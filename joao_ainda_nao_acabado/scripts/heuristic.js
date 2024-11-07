function evaluateBoard(gameState) {

    board = gameState.board;

    // moinho da AI
    let moinho = 0;
    for(let i = 0; i < gameState.size_board; i++){
         for(let j = 0; j < 8; j++){
            if(gameState.check_moinho(i, j)){
                moinho += 1;
            }
         }
    }

    // moinho dos oponentes
    let moinho_opponent = 0;
    gameState.turn = 1 - gameState.turn; // alternar a vez
    for(let i = 0; i < gameState.size_board; i++){
        for(let j = 0; j < 8; j++){
           if(gameState.turn == gameState.board[i][j] && gameState.check_moinho(i, j)){
               moinho += 1;
           }
        }
   }
   gameState.turn = 1 - gameState.turn; // alternar a vez

   // possible moinho da AI
   let possible_moinho = 0;      
   for(let i = 0; i < gameState.size_board; i++){
        for(let j = 0; j < 8; j++){
            if(gameState.check_almost_moinho(i, j)){
                possible_moinho += 1;
            }
        }
    }

    // possible moinho da AI
    gameState.turn = 1 - gameState.turn; // alternar a vez
    let possible_moinho_opponent = 0;      
    for(let i = 0; i < gameState.size_board; i++){
        for(let j = 0; j < 8; j++){
            if(gameState.check_almost_moinho(i, j)){
                possible_moinho_opponent += 1;
            }
        }
    }
    gameState.turn = 1 - gameState.turn; // alternar a vez

    // numero de jogadas possiveis da AI
    num_jogadas = gameState.jogadas_possiveis().length;

    //numero de jogadas possiveis do opponent
    gameState.turn = 1 - gameState.turn; // alternar a vez
    num_jogadas_opponent = gameState.jogadas_possiveis().length;
    gameState.turn = 1 - gameState.turn; // alternar a vez


    // gameState.blockedOpponentMills: number of potential opponent mills blocked by player


    // Mills and Potential Mills: give positive score for player's mills, negative for opponent's mills
    const mills = (moinho - moinho_opponent);
    const possiblemills = (possible_moinho - possible_moinho_opponent);
                                   

    // Blocking Opponent's Mills: score based on how many opponent mills the player blocked
    //const blockingOpponentMills = gameState.blockedOpponentMills;

    // Mobility: favor positions where player has more mobility than opponent
    const mobility = num_jogadas - num_jogadas_opponent;

    // Set weights
    const w2 = 50;  // Weight for Mills
    const w3 = 2; //Weight for Possible mills
    //const w3 = 5;   // Weight for Blocking Opponent's Mills
    const w4 = 1;   // Weight for Mobility

    // Final evaluation score
    const score = (w2 * mills) +  (w3 * possiblemills) +
                  (w4 * mobility);

    return score;
}
