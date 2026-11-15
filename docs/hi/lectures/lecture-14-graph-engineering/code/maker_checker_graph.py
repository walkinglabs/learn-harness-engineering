"""maker_checker_graph.py — A complete skeleton of the maker-checker graph built with LangGraph.

Maps to the six steps in Lecture 14, "Build Your First Graph from Scratch":
1. Define the shared state    2. List the nodes     3. Wire the edges
4. Write the routing rules    5. Attach a checkpointer   6. Run the graph

Dependency: pip install langgraph
The model calls inside the agent nodes (research/implement/verify) are stubbed —
wire them up to your own provider.
"""

from typing import Annotated, TypedDict
import operator

from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.memory import MemorySaver


# ---------- Step 1: Define the shared state ----------

class GraphState(TypedDict):
    requirements: str                              # written by the research node
    code: str                                      # written by the implement node
    review: str                                    # review verdict: pass / fail / unclear
    attempts: Annotated[int, operator.add]         # retry count, merged with +


# ---------- Step 2: List the nodes ----------

def call_model(system: str, content: str) -> str:
    """Model-call placeholder — connect your own provider (Anthropic / OpenAI / ...)."""
    raise NotImplementedError("Replace this with a real model call")


def research(state: GraphState) -> dict:
    # agent node: locate the problem, produce a requirements statement
    requirements = call_model("You are a research agent", f"Analyze this problem: {state.get('requirements', '')}")
    return {"requirements": requirements}


def implement(state: GraphState) -> dict:
    # agent node: write code + tests
    code = call_model("You are an implementation agent", f"Implement against: {state['requirements']}")
    return {"code": code}


def tests_pass(code: str) -> bool:
    """Deterministic check: run the tests. Placeholder — run pytest etc. in practice."""
    return "def test" in code  # placeholder: passing means the code contains a test


def verify(state: GraphState) -> dict:
    # agent node: independent review + run tests (must NOT share the implementer's context)
    review = call_model("You are an independent reviewer", f"Review this code: {state['code']}")
    passed = tests_pass(state["code"])
    verdict = "pass" if passed and "approved" in review else "fail"
    return {"review": verdict}


def merge(state: GraphState) -> dict:
    # deterministic node: commit
    print(f"Merging code (passed after {state['attempts']} attempts)")
    return {}


# ---------- Step 4: Write the routing rules (the most important step) ----------

def route_after_verify(state: GraphState) -> str:
    if state["review"] == "fail":
        return "implement"      # verify failed → back to implement
    return "merge"              # verify passed → merge


# ---------- Step 3: Wire the edges ----------

graph = StateGraph(GraphState)
graph.add_node("research", research)
graph.add_node("implement", implement)
graph.add_node("verify", verify)
graph.add_node("merge", merge)

graph.add_edge(START, "research")
graph.add_edge("research", "implement")
graph.add_edge("implement", "verify")
graph.add_conditional_edges(
    "verify",
    route_after_verify,
    {"implement": "implement", "merge": "merge"},
)
graph.add_edge("merge", END)


# ---------- Step 5: Compile with a checkpointer ----------
# The checkpointer persists state after every step: if the process dies,
# you resume from the checkpoint instead of starting over.

app = graph.compile(checkpointer=MemorySaver())


# ---------- Step 6: Run the graph ----------
# Pass a thread_id on every run — the checkpointer uses it to tell runs apart.

if __name__ == "__main__":
    result = app.invoke(
        {"requirements": "fix the login page bug", "attempts": 0},
        config={"configurable": {"thread_id": "session-1"}},
    )
    print(result)
