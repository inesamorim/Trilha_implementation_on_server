
const button_1 = document.querySelectorAll('.go_menu_inicial');
const button_2 = document.querySelectorAll('.go_configuracoes');
const button_3 = document.querySelectorAll('.go_regras');
const button_4 = document.querySelectorAll('.comecar_jogo');

const menu_inicial = document.querySelector('.menu_inicial');
const menu_regras = document.querySelector('.regras');
const menu_config = document.querySelector('.configuracoes');
const menu_jogo = document.querySelector('.jogo');

button_1.forEach(button => {
    button.addEventListener('click', function() { // mostrar menu inicial
    menu_regras.style.display = 'none';
    menu_config.style.display = 'none';
    menu_jogo.style.display = 'none';
    menu_inicial.style.display = 'block';
})});


button_2.forEach(button => {
    button.addEventListener('click', function() { // mostrar menu de config
    menu_inicial.style.display = 'none';
    menu_regras.style.display = 'none';
    menu_config.style.display = 'block';
})});

button_3.forEach(button => {
    button.addEventListener('click', function() { // mostrar menu de regras
    menu_inicial.style.display = 'none';
    menu_config.style.display = 'none';
    menu_regras.style.display = 'block';
})});

button_4.forEach(button => {
    button.addEventListener('click', function() { // mostrar menu de regras
    menu_config.style.display = 'none';
    menu_jogo.style.display = 'flex';
})});