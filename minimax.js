// Holds the board state and history
class State {
    constructor(board) {
      //this.board = board;
      this.history = []; // lista de classes 'game' - inclui board, turn, pieces e fase
    }
  
    // Executes an action and updates the history
    execute(move) {
      const state = structuredClone(state.history[state.history.length -1].board);
      //state deve ser uma copia, para n dar merda
      this.history.push(state); // game
      // action.execute(this.board);
    }
  
    // Undoes the last action and updates history
    undo() {  
      this.cur_hist -= 1;
      const state = this.history.pop(); //apaga tudo depois do cur_hist
      return state;
    }
  }
  
  function executeMinimaxMove(evaluateFunc, depth) {
    return function executeMinimaxMoveAux(state) {
      /**
       * Updates the game state to the best possible move (uses minimax to determine it)
       */
      let bestMoves = [];
      let bestEval = -Infinity;
      const actions = state.history[state.history.length -1].jogadas_possiveis(); //ultimo elemento do histórico; o retorno depende da fase
      const fase = state.history[state.history.length -1].fase; 
  
      if (actions.length === 1) {
        // There isn't much to do and this can take a long time
        return actions[0];
      }
  
      const player = state.history[state.history.length-1].turn;
      for (const move of actions) {
        state.execute(move);
        const newStateEval = minimax(
          state,
          depth - 1,
          -Infinity,
          Infinity,
          false,
          player,
          evaluateFunc
        );
        state.undo();
  
        if (newStateEval > bestEval) {
          bestMoves = [move];
          bestEval = newStateEval;
        } else if (newStateEval === bestEval) {
          bestMoves.push(move);
        }
      }
  
      if (bestMoves.length === 0) {
        throw new Error(`Board has no valid actions ${state.history[state.history.length -1].board}`);
      }
  
      const randomMove = bestMoves[Math.floor(Math.random() * bestMoves.length)];
      return randomMove;
    };
  }
  
  function minimax(state, depth, alpha, beta, maximizing, player, evaluateFunc) {
    if (depth === 0 || state.board.isTerminal() !== 0) {
      return evaluateFunc(state) * (player === 1 ? 1 : -1);
    }
  
    if (maximizing) {
      let maxEval = -Infinity;
      for (const move of state.history[state.history.length -1].jogadas_possiveis()()) {
        state.execute(move);
        const eval = minimax(
          state,
          depth - 1,
          alpha,
          beta,
          false,
          player,
          evaluateFunc
        );
        state.undo();
        maxEval = Math.max(maxEval, eval);
        alpha = Math.max(alpha, eval);
        if (beta <= alpha) {
          break;
        }
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (const move of state.history[state.history.length -1].jogadas_possiveis()()) {
        state.execute(move);
        const eval = minimax(
          state,
          depth - 1,
          alpha,
          beta,
          true,
          player,
          evaluateFunc
        );
        state.undo();
        minEval = Math.min(minEval, eval);
        beta = Math.min(beta, eval);
        if (beta <= alpha) {
          break;
        }
      }
      return minEval;
    }
  }