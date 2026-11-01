<script>
        const descontoPix = 0.10;

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
                const valorFreteFinal = tabelaFretePorEstado[uf] || 35.00;

                atualizarTodosOsProdutos(valorFreteFinal, regiaoNome, uf);
                
                // Fecha a janela e move o foco para o catálogo
                fecharModalEMoverParaCatalogo();
            } else {
                document.getElementById('modal-erro').style.color = "#aaa";
                document.getElementById('modal-erro').innerText = "Digitando... (insira os 8 dígitos)";
            }
        }

        // Nova função que executa o fechamento e chama a visualização da classe do catálogo
        function pularCep() {
            atualizarTodosOsProdutos(0, "Combinar Retirada", "GRÁTIS");
            fecharModalEMoverParaCatalogo();
        }

        function fecharModalEMoverParaCatalogo() {
            // Remove a janela de bloqueio preta
            document.getElementById('modal-cep').style.display = 'none';
            
            // Localiza a classe .catalogo (main) e faz a tela descer até ela
            const catalogoSection = document.querySelector('header');
            if (catalogoSection) {
                catalogoSection.scrollIntoView({ behavior: 'smooth' });
            }
        }

        function atualizarTodosOsProdutos(valorFrete, regiao, uf) {
            const produtos = document.querySelectorAll('.class-produto');

            produtos.forEach(produto => {
                const precoProduto = parseFloat(produto.getAttribute('data-preco'));
                const linkBaseCartao = produto.getAttribute('data-link-cartao');
                const linkBasePix = produto.getAttribute('data-link-pix');

                const totalCartao = precoProduto + valorFrete;
                const totalPix = (precoProduto * (1 - descontoPix)) + valorFrete;
                const valorParcela = totalCartao / 10;

                const txtFrete = valorFrete === 0 ? "🚚 Retirada ou Frete a combinar" : `🚚 Frete para ${regiao} (${uf}): R$ ${valorFrete.toFixed(2).replace('.', ',')}`;
                produto.querySelector('.info-frete-texto').innerText = txtFrete;
                produto.querySelector('.preco-texto').innerText = `R$ ${totalCartao.toFixed(2).replace('.', ',')}`;
                
                produto.querySelector('.btn-cartao').innerHTML = `💳 Comprar em até 10x de R$ ${valorParcela.toFixed(2).replace('.', ',')} sem juros`;
                produto.querySelector('.btn-cartao').href = `${linkBaseCartao}?price=${totalCartao}`;

                produto.querySelector('.btn-pix').innerHTML = `🟢 Pagar no Pix por R$ ${totalPix.toFixed(2).replace('.', ',')}`;
                produto.querySelector('.btn-pix').href = `${linkBasePix}?price=${totalPix}`;
            });
        }
        
        atualizarTodosOsProdutos(0, "", "");
                // Funções para controle do Zoom da Imagem (Lightbox)
        function abrirZoom(elementoImg) {
            const lightbox = document.getElementById('lightbox');
            const imagemZoom = document.getElementById('imagem-zoom');
            
            // Passa o caminho da imagem clicada para a janela grande
            imagemZoom.src = elementoImg.src;
            imagemZoom.alt = elementoImg.alt;
            
            // Exibe a janela de zoom
            lightbox.style.display = 'flex';
        }

        function fecharZoom() {
            // Esconde a janela ao clicar fora da imagem
            document.getElementById('lightbox').style.display = 'none';
        }

    </script>
