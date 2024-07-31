let contadorProdutos = 1;

if (document.querySelector('[name="cep"]')) document.querySelector('[name="cep"]').addEventListener('blur', buscaCep);

function buscaCep() {
    const cep = document.querySelector('[name="cep"]').value;
    if (cep) {
        fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then(response => response.json())
            .then(data => {
                if (!data.erro) {
                    document.querySelector('[name="endereco"]').value = data.logradouro;
                    document.querySelector('[name="bairro"]').value = data.bairro;
                    document.querySelector('[name="municipio"]').value = data.localidade;
                    document.querySelector('[name="estado"]').value = data.uf;
                } else {
                    alert('CEP não encontrado');
                }
            });
    }
}

function contarProduto(id) {
    const qdtdeEstoque = document.querySelector(`[name="qdtde-estoque-${id}"]`);
    const valorUnitario = document.querySelector(`[name="valor-unitario-${id}"]`);

    if (qdtdeEstoque && valorUnitario) {
        qdtdeEstoque.addEventListener('input', () => updateTotal(id));
        valorUnitario.addEventListener('input', () => updateTotal(id));
    }

}
function updateTotal(id) {
    const quantidade = document.querySelector(`[name="qdtde-estoque-${id}"]`).value;
    const valorUnitario = document.querySelector(`[name="valor-unitario-${id}"]`).value;
    const valorTotal = quantidade * valorUnitario;

    document.querySelector(`[name="valor-total-${id}"]`).value = valorTotal.toFixed(2);
}

function adicionarProduto() {
    contadorProdutos++;
    const produtoDiv = document.createElement('div');
    produtoDiv.classList.add('produto');
    produtoDiv.id = `produto-${contadorProdutos}`;
    produtoDiv.innerHTML = `
                <div id="produto-${contadorProdutos}">
                    <button class="btn-del" type="button" onclick="deletarProduto(${contadorProdutos})">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                    <div class="flexbox">
                        <div>
                            <label for="produto">Produto ${contadorProdutos}:</label>
                            <div class="grid-1-spaces">
                                <input class="input-commum" type="text" name="produto" id="produto" />
                            </div>
                            <div class="grid-4-spaces">
                                <div>
                                    <label for="und_medida">Unidade de Medida:</label>
                                    <select class="option-und" name="unidade-medida" required>
                                        <option selected disabled value="unidade">Unidade</option>
                                        <option value="kg">Kg</option>
                                        <option value="litro">Litro</option>
                                    </select>
                                </div>
                                <div>
                                    <label for="qdtde-estoque"> Quantidade em Estoque:</label>
                                    <input class="input-commum" type="number" name="qdtde-estoque-${contadorProdutos}" id="qdtde-estoque" />
                                </div>
                                <div>
                                    <label for="valor-unitario">Valor Unitário:</label>
                                    <input class="input-commum" type="number" name="valor-unitario-${contadorProdutos}" id="valor-unitario" />
                                </div>
                                <div>
                                    <label for="valor-total">Valor Total:</label>
                                    <input class="input-commum" type="text" name="valor-total-${contadorProdutos}" id="valor-total" />
                                </div>
                            </div>
                        </div>
                        <img class="caixa" src=imagens/caixa.png />
                    </div>
                </div>`;
    document.getElementById('produtos').appendChild(produtoDiv);
    contarProduto(contadorProdutos);
}

function deletarProduto(id) {
    if (contadorProdutos > 1) {
        document.getElementById(`produto-${id}`).remove();
        contadorProdutos--;
    } else {
        alert('Você deve ter pelo menos um produto.');
    }
}

contarProduto(1);