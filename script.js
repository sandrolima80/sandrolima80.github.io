
// LÓGICA DO ZOOM (LIGHTBOX) CORRIGIDA PARA RODAR APENAS DENTRO DO MESMO PRODUTO
function abrirZoom(elementoImg) {
    const lightbox = document.getElementById('lightbox');
    const imagemZoom = document.getElementById('imagem-zoom');
    
    // Encontra o card do produto dono dessa imagem
    const cardProdutoPai = elementoImg.closest('.class-produto');
    
    // Captura apenas as imagens que estão DENTRO desse produto específico
    const imagensDesteProduto = cardProdutoPai.querySelectorAll('img');
    imagensProdutosLista = Array.from(imagensDesteProduto);
    
    // Descobre o índice da foto clicada dentro do grupo desse produto
    indiceImagemAtual = imagensProdutosLista.indexOf(elementoImg);
    
    // Alimenta o zoom com a foto atual
    imagemZoom.src = elementoImg.src;
    imagemZoom.alt = elementoImg.alt;
    
    lightbox.style.display = 'flex';
}

function mudarImagemZoom(direcao, evento) {
    // Evita que o clique nas setas feche a janela
    evento.stopPropagation();
    
    indiceImagemAtual += direcao;
    
    // Faz a rotação infinita presa apenas às fotos deste produto
    if (indiceImagemAtual >= imagensProdutosLista.length) {
        indiceImagemAtual = 0;
    }
    if (indiceImagemAtual < 0) {
        indiceImagemAtual = imagensProdutosLista.length - 1;
    }
    
    const novaImagem = imagensProdutosLista[indiceImagemAtual];
    const imagemZoom = document.getElementById('imagem-zoom');
    imagemZoom.src = novaImagem.src;
    imagemZoom.alt = novaImagem.alt;
}

function fecharZoom() {
    document.getElementById('lightbox').style.display = 'none';
}


// Inicializa a vitrine
atualizarTodosOsProdutos(0, "", "");




    
