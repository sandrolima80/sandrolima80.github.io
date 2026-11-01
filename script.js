
// CONFIGURAÇÕES BASE DO E-COMMERCE
const descontoPix = 0.10;
let valorFreteGlobal = 0;

// INICIALIZAÇÃO HOMOLOGADA DO MERCADO PAGO COM A SUA CHAVE
const mp = new MercadoPago('APP_USR-8477fe81-98de-40ce-ab2e-4e1b93a3d204', {
    locale: 'pt-BR'
});

const tabelaFretePorEstado = {
    'SP': 15.00, 'RJ': 25.00, 'MG': 25.00, 'ES': 25.00,
    'PR': 32.00, 'SC': 32.00, 'RS': 32.00,
    'DF': 35.00, 'GO': 35.00, 'MT': 35.00, 'MS': 35.00,
    'BA': 40.00, 'CE': 42.00, 'PE': 42.00, 'MA': 45.00, 'PB': 45.00, 'PI': 45.00, 'RN': 45.00, 'SE': 45.00, 'AL': 45.00,
    'AM': 55.00, 'PA': 55.00, 'AC': 55.00, 'RO': 55.00, 'RR': 55.00, 'AP': 55.00, 'TO': 48.00
};

function descobrirEstadoPorCEP(cep) {
    const r2 = cep.substring(0, 2);
    const r3 = cep.substring(0, 3);
    
    if (r2 >= "01" && r2 <= "19") return { uf: 'SP', regiao: 'São Paulo' };
    if (r2 >= "20" && r2 <= "28") return { uf: 'RJ', regiao: 'Rio de Janeiro' };
    if (r2 === "29") return { uf: 'ES', regiao: 'Espírito Santo' };
    if (r2 >= "30" && r2 <= "39") return { uf: 'MG', regiao: 'Minas Gerais' };
    if (r2 >= "40" && r2 <= "48") return { uf: 'BA', regiao: 'Bahia' };
    if (r2 === "49") return { uf: 'SE', regiao: 'Sergipe' };
    if (r2 >= "50" && r2 <= "56") return { uf: 'PE', regiao: 'Pernambuco' };
    if (r2 === "57") return { uf: 'AL', regiao: 'Alagoas' };
    if (r2 === "58") return { uf: 'PB', regiao: 'Paraíba' };
    if (r2 === "59") return { uf: 'RN', regiao: 'Rio Grande do Norte' };
    if (r2 >= "60" && r2 <= "63") return { uf: 'CE', regiao: 'Ceará' };
    if (r2 === "64") return { uf: 'PI', regiao: 'Piauí' };
    if (r2 === "65") return { uf: 'MA', regiao: 'Maranhão' };
    if (r2 >= "66" && r2 <= "67") return { uf: 'PA', regiao: 'Pará' };
    if (r2 === "68") {
        if (r3 >= "680" && r3 <= "688") return { uf: 'PA', regiao: 'Pará' };
        if (r3 === "689") return { uf: 'AP', regiao: 'Amapá' };
    }
    if (r3 >= "690" && r3 <= "692") return { uf: 'AM', regiao: 'Amazonas' };
    if (r3 === "693") return { uf: 'RR', regiao: 'Roraima' };
    if (r3 >= "694" && r3 <= "698") return { uf: 'AM', regiao: 'Amazonas' };
    if (r3 === "699") return { uf: 'AC', regiao: 'Acre' };
    if (r2 >= "70" && r2 <= "72") return { uf: 'DF', regiao: 'Distrito Federal' };
    if (r2 >= "73" && r2 <= "76") return { uf: 'GO', regiao: 'Goiás' };
    if (r2 === "77") return { uf: 'TO', regiao: 'Tocantins' };
    if (r2 === "78") return { uf: 'MT', regiao: 'Mato Grosso' };
    if (r2 === "79") return { uf: 'MS', regiao: 'Mato Grosso do Sul' };
    if (r2 >= "80" && r2 <= "87") return { uf: 'PR', regiao: 'Paraná' };
    if (r2 >= "88" && r2 <= "89") return { uf: 'SC', regiao: 'Santa Catarina' };
    if (r2 >= "90" && r2 <= "99") return { uf: 'RS', regiao: 'Rio Grande do Sul' };
    return null;
}

function monitorarDigitacaoCEP(input) {
    let v = input.value.replace(/\D/g, "");
    
    if (v.length > 5) {
        input.value = v.substring(0, 5) + "-" + v.substring(5, 8);
    } else {
        input.value = v;
    }

    if (v.length === 8) {
        const localizacao = descobrirEstadoPorCEP(v);
        const uf = localizacao ? localizacao.uf : 'SP';
        const regiaoNome = localizacao ? localizacao.regiao : 'Brasil';
        valorFreteGlobal = tabelaFretePorEstado[uf] || 35.00;

        atualizarTodosOsProdutos(valorFreteGlobal, regiaoNome, uf);
        fecharModalEMoverParaCatalogo();
    } else {
        document.getElementById('modal-erro').style.color = "#aaa";
        document.getElementById('modal-erro').innerText = "Digitando... (insira os 8 dígitos)";
    }
}

function pularCep() {
    valorFreteGlobal = 0;
    atualizarTodosOsProdutos(0, "Combinar Retirada", "GRÁTIS");
    fecharModalEMoverParaCatalogo();
}

function fecharModalEMoverParaCatalogo() {
    document.getElementById('modal-cep').style.display = 'none';
    const catalogoSection = document.querySelector('.catalogo');
    if (catalogoSection) {
        catalogoSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function atualizarTodosOsProdutos(valorFrete, regiao, uf) {
    const produtos = document.querySelectorAll('.class-produto');

    produtos.forEach((produto, index) => {
        const precoProduto = parseFloat(produto.getAttribute('data-preco'));
        
        const totalGeral = precoProduto + valorFrete;
        const valorPrestacao = totalGeral / 10;
        const totalPixComDesconto = totalGeral * (1 - descontoPix);

        const pNum = index + 1;
        
        document.getElementById(`preco-base-p${pNum}`).innerText = `Peça: R$ ${precoProduto.toFixed(2).replace('.', ',')}`;

        const txtFrete = valorFrete === 0 ? "🚚 Valor do frete: A combinar / Grátis" : `🚚 Valor do frete para ${regiao} (${uf}): R$ ${valorFrete.toFixed(2).replace('.', ',')}`;
        produto.querySelector('.info-frete-texto').innerText = txtFrete;

        document.getElementById(`linha-cartao-p${pNum}`).innerText = `Valor em 10x sem juros: R$ ${totalGeral.toFixed(2).replace('.', ',')} (10x de R$ ${valorPrestacao.toFixed(2).replace('.', ',')})`;
        document.getElementById(`linha-pix-p${pNum}`).innerText = `No Pix 10% de desconto: R$ ${totalPixComDesconto.toFixed(2).replace('.', ',')}`;

        // Vincula a abertura nativa do checkout do Mercado Pago com o valor somado
        const btnComprar = produto.querySelector('.btn-comprar-unico');
        btnComprar.onclick = function(e) {
            e.preventDefault();
            
            const nomeProduto = produto.querySelector('h2').innerText;
            
            // Abre o painel integrado oficial do Mercado Pago na tela do cliente
            mp.checkout({
                preference: {
                    items: [{
                        title: nomeProduto,
                        unit_price: parseFloat(totalGeral.toFixed(2)),
                        quantity: 1,
                        currency_id: 'BRL'
                    }]
                },
                autoOpen: true
            });
        };
    });
}

// LÓGICA DO ZOOM (LIGHTBOX)
let imagensProdutosLista = [];
let indiceImagemAtual = 0;

function abrirZoom(elementoImg) {
    const lightbox = document.getElementById('lightbox');
    const imagemZoom = document.getElementById('imagem-zoom');
    const cardProdutoPai = elementoImg.closest('.class-produto');
    const imagensDesteProduto = cardProdutoPai.querySelectorAll('img');
    imagensProdutosLista = Array.from(imagensDesteProduto);
    indiceImagemAtual = imagensProdutosLista.indexOf(elementoImg);
    
    imagemZoom.src = elementoImg.src;
    imagemZoom.alt = elementoImg.alt;
    lightbox.style.display = 'flex';
}

function mudarImagemZoom(direcao, evento) {
    evento.stopPropagation();
    indiceImagemAtual += direcao;
    
    if (indiceImagemAtual >= imagensProdutosLista.length) indiceImagemAtual = 0;
    if (indiceImagemAtual < 0) indiceImagemAtual = imagensProdutosLista.length - 1;
    
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




    
