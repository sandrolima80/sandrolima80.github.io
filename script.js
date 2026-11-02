let carrinho = [];
let valorFreteGlobal = 0;
let estadoSelecionadoTxt = "Aguardando CEP";
let ufGlobal = "";

const tabelaFretePorEstado = {
    'SP': 15.00, 'RJ': 25.00, 'MG': 25.00, 'ES': 25.00,
    'PR': 32.00, 'SC': 32.00, 'RS': 32.00,
    'DF': 35.00, 'GO': 35.00, 'MT': 35.00, 'MS': 35.00,
    'BA': 40.00, 'CE': 42.00, 'PE': 42.00, 'MA': 45.00, 'PB': 45.00, 'PI': 45.00, 'RN': 45.00, 'SE': 45.00, 'AL': 45.00,
    'AM': 55.00, 'PA': 55.00, 'AC': 55.00, 'RO': 55.00, 'RR': 55.00, 'AP': 55.00, 'TO': 48.00
};

// CONTROLE DA INTERFACE DO CARRINHO
function alternarCarrinho(abrir) {
    const menu = document.getElementById("carrinho-menu");
    if (menu) {
        if (abrir) menu.classList.add("aberto");
        else menu.classList.remove("aberto");
    }
}

// ADICIONAR ITEM AO CARRINHO
function adicionarAoCarrinho(id, titulo, preco, foto) {
    const itemExistente = carrinho.find(item => item.id === id);

    if (itemExistente) {
        itemExistente.quantidade += 1;
    } else {
        carrinho.push({ id, titulo, preco, foto, quantity: 1 });
    }

    atualizarRenderizacaoCarrinho();
    alternarCarrinho(true);
}

// REMOVER ITEM
function removerDoCarrinho(id) {
    carrinho = carrinho.filter(item => item.id !== id);
    atualizarRenderizacaoCarrinho();
}

// ATUALIZA VALORES E RENDERIZA NA TELA
function atualizarRenderizacaoCarrinho() {
    const listaHtml = document.getElementById("carrinho-itens-lista");
    const contador = document.getElementById("carrinho-contador");
    
    if (contador) {
        contador.innerText = Array.isArray(carrinho) ? carrinho.reduce((acc, item) => acc + item.quantidade, 0) : 0;
    }

    if (!carrinho || carrinho.length === 0) {
        if (listaHtml) listaHtml.innerHTML = `<p style="color: #aaa; text-align: center; margin-top: 20px;">Seu carrinho está vazio.</p>`;
        document.getElementById("cart-subtotal").innerText = "R$ 0,00";
        document.getElementById("cart-total-geral").innerText = "R$ 0,00";
        document.getElementById("cart-total-pix").innerText = "R$ 0,00";
        
        const btnCheckout = document.getElementById("btn-finalizar-checkout");
        if (btnCheckout) {
            btnCheckout.disabled = true;
            btnCheckout.innerText = "🔒 Carrinho Vazio";
            btnCheckout.style.backgroundColor = "#555";
        }
        return;
    }

    if (listaHtml) {
        listaHtml.innerHTML = "";
        carrinho.forEach(item => {
            listaHtml.innerHTML += `
                <div class="item-carrinho-linha">
                    <img src="${item.foto}" alt="${item.titulo}">
                    <div class="item-detalhes">
                        <h4>${item.titulo}</h4>
                        <span>${item.quantidade}x R$ ${item.preco.toFixed(2).replace('.', ',')}</span>
                    </div>
                    <button class="btn-remover-item" onclick="removerDoCarrinho('${item.id}')">&times;</button>
                </div>
            `;
        });
    }

    const subtotal = carrinho.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
    const totalGeral = subtotal + valorFreteGlobal;
    const totalPix = totalGeral * 0.90;

    document.getElementById("cart-subtotal").innerText = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
    const btnCheckout = document.getElementById("btn-finalizar-checkout");

    if (estadoSelecionadoTxt === "Aguardando CEP" || ufGlobal === "") {
        document.getElementById("cart-frete-txt").innerText = "🚚 Frete:";
        document.getElementById("cart-frete-valor").innerText = "Por favor, digite o frete";
        document.getElementById("cart-frete-valor").style.color = "#ff4d4d";
        document.getElementById("cart-total-geral").innerText = `R$ ${subtotal.toFixed(2).replace('.', ',')} + frete`;
        document.getElementById("cart-total-pix").innerText = "Aguardando CEP...";
        
        if (btnCheckout) {
            btnCheckout.disabled = true;
            btnCheckout.innerText = "⚠️ Por favor, digite o frete para continuar";
            btnCheckout.style.backgroundColor = "#555";
        }
    } else {
        document.getElementById("cart-frete-txt").innerText = `🚚 Frete para ${estadoSelecionadoTxt}:`;
        document.getElementById("cart-frete-valor").innerText = valorFreteGlobal === 0 ? "GRÁTIS" : `R$ ${valorFreteGlobal.toFixed(2).replace('.', ',')}`;
        document.getElementById("cart-frete-valor").style.color = valorFreteGlobal === 0 ? "#2ecc71" : "#fff";
        document.getElementById("cart-total-geral").innerText = `R$ ${totalGeral.toFixed(2).replace('.', ',')}`;
        document.getElementById("cart-total-pix").innerText = `R$ ${totalPix.toFixed(2).replace('.', ',')}`;
        
        if (btnCheckout) {
            btnCheckout.disabled = false;
            btnCheckout.innerText = "🔒 Fechar Pedido via Mercado Pago";
            btnCheckout.style.backgroundColor = "#2ecc71";
        }
    }
}


// LOGICA DE RECONHECIMENTO DE CEP
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
    let apenasNumeros = input.value.replace(/\D/g, "");
    
    if (apenasNumeros.length > 5) {
        input.value = apenasNumeros.substring(0, 5) + "-" + apenasNumeros.substring(5, 8);
    } else {
        input.value = apenasNumeros;
    }

    const msgErroModal = document.getElementById('modal-erro');
    const msgErroCarrinho = document.getElementById('carrinho-cep-erro');

    if (apenasNumeros.length === 8) {
        const loc = descobrirEstadoPorCEP(apenasNumeros);
        ufGlobal = loc ? loc.uf : 'SP';
        estadoSelecionadoTxt = loc ? `${loc.regiao} (${loc.uf})` : 'São Paulo (SP)';
        valorFreteGlobal = tabelaFretePorEstado[ufGlobal] || 15.00;
        
        if(document.getElementById('cep-inicial')) document.getElementById('cep-inicial').value = input.value;
        if(document.getElementById('cep-carrinho')) document.getElementById('cep-carrinho').value = input.value;

        if(msgErroModal) msgErroModal.innerText = "";
        if(msgErroCarrinho) msgErroCarrinho.innerText = "";
        
        atualizarRenderizacaoCarrinho();
        
        if(document.getElementById('modal-cep')) {
            document.getElementById('modal-cep').style.display = 'none';
        }
    } else {
        if (input.id === "cep-inicial" && msgErroModal) {
            msgErroModal.style.color = "#aaa";
            msgErroModal.innerText = "Digitando... (insira os 8 dígitos)";
        } else if (input.id === "cep-carrinho" && msgErroCarrinho) {
            msgErroCarrinho.style.color = "#aaa";
            msgErroCarrinho.innerText = "Digitando CEP...";
        }
    }
}

function pularCep() {
    valorFreteGlobal = 0;
    ufGlobal = "";
    estadoSelecionadoTxt = "Aguardando CEP";
    atualizarRenderizacaoCarrinho();
    if(document.getElementById('modal-cep')) {
        document.getElementById('modal-cep').style.display = 'none';
    }
}

// INTEGRAÇÃO DO CHECKOUT COM O SEU PHP LOCAL VIA NGROK
async function checkoutMercadoPago() {
    const btn = document.getElementById("btn-finalizar-checkout");
    if (!btn) return;
    
    btn.innerText = "🔄 Gerando Checkout Seguro...";
    btn.disabled = true;

    try {
        const urlSuaApi = "https://ngrok-free.dev";

        const resposta = await fetch(urlSuaApi, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "ngrok-skip-browser-warning": "true"
            },
            body: JSON.stringify({
                itens: carrinho, 
                frete: valorFreteGlobal 
            })
        });

        const dados = await resposta.json();

        if (dados && dados.init_point) {
            window.open(dados.init_point, "_blank");
        } else {

console.error("Resposta do servidor:", dados);
alert("Erro ao ler os dados de pagamento devolvidos pelo servidor.");
}
} catch (erro) {
console.error("Erro na comunicação com o PHP:", erro);
alert("Não foi possível conectar ao seu servidor PHP para fechar o pedido.");
} finally {
btn.innerText = "🔒 Fechar Pedido via Mercado Pago";
btn.disabled = false;
}
}
    
