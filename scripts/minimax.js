// Holds the board state and history
class State {
    constructor() {
      //this.board = board;
      this.history = []; // lista de classes 'game' - inclui board, turn, pieces e fase
    }
  
    // Executes an action and updates the history
    execute(move, start_pos = [-1,-1]) {
      //move é um elemento das jogadas possíveis
      const new_state = _.cloneDeep(this.history[this.history.length-1]);
      //const new_state = structuredClone(this.history[this.history.length -1].board);

      //moinho
      if(new_state.remove_peca){
        new_state.remover_peca(move[0], move[1]);
        new_state.remove_peca = false;
      }

      //fase 1 - colocar peças
      else if (!new_state.fase) {
        new_state.colocar_peca(move[0],move[1]);
        //new_state.board[move[0]][move[1]];
        if(new_state.pieces_por_colocar === 0) {
          new_state.fase = 1;
        }
      }

      //fase 2 - mover peças
      else if(new_state.pieces[new_state.turn] > 3) {
        new_state.remover_peca(start_pos[0], start_pos[1]);
        new_state.colocar_peca(move[0], move[1]);
      }

      this.history.push(new_state); // game
    }
  
    // Undoes the last action and updates history
    undo() {  
      const state = this.history.pop(); //apaga tudo depois do cur_hist
      return state;
    }
  }
  
  function executeMinimaxMove(evaluateFunc, depth) {
    return function executeMinimaxMoveAux(trilha) {
      /**
       * Updates the game state to the best possible move (uses minimax to determine it)
       */
      let bestMoves = [];
      let bestEval = -Infinity;

      const state_copy = _.cloneDeep(trilha);
      //const state_copy = structuredClone(trilha); // cópia do state dado
      const state = new State();
      state.history.push(state_copy);

      let actions = [];
      if (state_copy.remove_peca){
        actions = state_copy.jogadas_remover();
      }

      else {
        actions = state.history[state.history.length -1].jogadas_possiveis(); //ultimo elemento do histórico; o retorno depende da fase
      }

      
      const fase = state.history[state.history.length -1].fase; 
      const player = state.history[state.history.length-1].turn;
  
      if (actions.length === 1) {
        // There isn't much to do and this can take a long time
        return actions[0];
      }
      
      let start_pos = [];
      let best_start_pos = [];
      let sliced_move;
      for (let move of actions) {
        //fase 1 ou remover
        if(Number.isInteger(move[0])) {
          //start_pos = [-1,-1]; //buffer
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
            //best_start_pos = [start_pos];
            bestEval = newStateEval;
          } else if (newStateEval === bestEval) {
            bestMoves.push(move);
            //best_start_pos.push(best_start_pos);
          }
        }

        //fase 2
        else {
            start_pos = move[0]; 
            sliced_move = move.slice(1); //moves possiveis
            for(let i of sliced_move) {
              if(Number.isInteger(i[0])){
                state.execute(i, start_pos);

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
                  bestMoves = [i];
                  best_start_pos = [start_pos];
                  bestEval = newStateEval;
                } else if (newStateEval === bestEval) {
                  bestMoves.push(i);
                  best_start_pos.push(start_pos);
                }
             }
             else{
              for(let j of i){
                state.execute(j, start_pos);

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
                  bestMoves = [j];
                  best_start_pos = [start_pos];
                  bestEval = newStateEval;
                } else if (newStateEval === bestEval) {
                  bestMoves.push(j);
                  best_start_pos.push(start_pos);
                }
              }
            }  
            }
            
          }
        
      }
  
      if (bestMoves.length === 0) {
        return ([-1,-1], [-1,-1]);
        throw new Error(`Board has no valid actions ${state.history[state.history.length -1].board}`);
      }
      console.log(bestEval);
      //console.log(bestMoves);
      

      const j = Math.floor(Math.random() * bestMoves.length);
      const randomMove = [bestMoves[j], best_start_pos[j]]
      return randomMove;
    };
  }
  
  function minimax(state, depth, alpha, beta, maximizing, player, evaluateFunc) {
    if (depth === 0 || state.history[state.history.length -1].is_terminal_move()) {
      const eval = evaluateFunc(state.history[state.history.length -1]);
      //console.log(eval);
      return eval// * (player === 1 ? 1 : -1);
    }
  
    if (maximizing) {
      let maxEval = -Infinity;
      const actions = state.history[state.history.length -1].jogadas_possiveis();
      for (let move of actions) {
        //fase 1 ou remover
        if(Number.isInteger(move[0])) {
          //start_pos = [-1,-1]; //buffer
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
          maxEval = Math.max(maxEval, newStateEval);
          alpha = Math.max(alpha, newStateEval);
          if (beta <= alpha) {
            break;
          }
        }

        //fase 2
        else {
            start_pos = move[0]; 
            sliced_move = move.slice(1); //moves possiveis
            for(let i of sliced_move) {
              state.execute(i, start_pos);

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
              maxEval = Math.max(maxEval, newStateEval);
              alpha = Math.max(alpha, newStateEval);
              if (beta <= alpha) {
                break;
              }
            }
          }
        
      }
      return maxEval;

    } 
    else {
      let minEval = Infinity;
      const actions = state.history[state.history.length -1].jogadas_possiveis();
      for (let move of actions) {
        //fase 1 ou remover
        if(Number.isInteger(move[0])) {
          //start_pos = [-1,-1]; //buffer
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
          minEval = Math.min(minEval, newStateEval);
          beta = Math.min(beta, newStateEval);
          if (beta <= alpha) {
            break;
          }
        }

        //fase 2
        else {
            start_pos = move[0]; 
            sliced_move = move.slice(1); //moves possiveis
            for(let i of sliced_move) {
              state.execute(i, start_pos);

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
              minEval = Math.min(minEval, newStateEval);
              beta = Math.min(beta, newStateEval);
              if (beta <= alpha) {
                break;
              }
            }
          }
      
      return minEval;
      }
    }
  }
