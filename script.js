let contadorProdutos = 1;
let contadorAnexos = 1;
let arquivosAnexos = {};

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
    const qtdEstoque = document.querySelector(`[name="qtd-estoque-${id}"]`);
    const valorUnitario = document.querySelector(`[name="valor-unitario-${id}"]`);

    if (qtdEstoque && valorUnitario) {
        qtdEstoque.addEventListener('input', () => atualizarTotal(id));
        valorUnitario.addEventListener('input', () => atualizarTotal(id));
    }

}
function atualizarTotal(id) {
    const quantidade = document.querySelector(`[name="qtd-estoque-${id}"]`).value;
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
                <label for="produto">Produto:</label>
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
                        <label for="qtd-estoque"> Quantidade em Estoque:</label>
                        <input class="input-commum" type="number" name="qtd-estoque-${contadorProdutos}" id="qtd-estoque" />
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

function selecaoArquivo(event) {
    const input = event.target;
    const file = input.files[0];
    if (file) {
        adicionarAnexo(file);
        input.value = '';
    }
}

function adicionarAnexo(file) {
    arquivosAnexos[contadorAnexos] = file;

    const anexoDiv = document.createElement('div');
    anexoDiv.innerHTML = `
    <div id="anexo-${contadorAnexos}">
        <div class="bordas-secundarias">
            <label for="itens">Item:</label>
            <div class="flex-anexo">
                <div class="anexo-item">
                    <div class="grid-3-spaces">
                        <button class="btn-del" type="button" onclick="deletarAnexo(${contadorAnexos})">
                            <i class="fas fa-trash-alt"></i>
                            </button>
                            <button class="btn-olho" type="button" onclick="baixarAnexo(${contadorAnexos})">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </div>
                <div>
                    <div>
                        <p>${file.name}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;
    document.getElementById('anexos').appendChild(anexoDiv);
}

function deletarAnexo(id) {
    document.getElementById(`anexo-${id}`).remove();
    contadorAnexos--;
}

function baixarAnexo(id) {
    const file = arquivosAnexos[id];
    if (file) {
        const url = URL.createObjectURL(file);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name;
        a.click();
        URL.revokeObjectURL(url);
    } else {
        alert('Anexo não encontrado');
    }
}

function salvarFornecedor(event) {
    event.preventDefault();

    const formalario = document.querySelector('form');
    
    if(Object.keys(arquivosAnexos).length < 1 || contadorAnexos < 1) {
        alert('Por favor, preencha pelo menos um anexo.');
        return;
    }

    if (!formalario.checkValidity()) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }

    const modal = document.getElementById('modal-carregamento');
    modal.style.display = 'block';

    const fornecedor = {
        razaoSocial: document.querySelector('[name="razao-social"]').value,
        nomeFantasia: document.querySelector('[name="nome"]').value,
        cnpj: document.querySelector('[name="cnpj"]').value,
        inscricaoEstadual: document.querySelector('[name="estadual-ins"]') ? document.querySelector('[name="estadual-ins"]').value : null,
        inscricaoMunicipal: document.querySelector('[name="municipal-ins"]') ? document.querySelector('[name="municipal-ins"]').value : null,
        endereco: document.querySelector('[name="endereco"]').value,
        numero: document.querySelector('[name="numero"]').value,
        complemento: document.querySelector('[name="complemento"]').value,
        bairro: document.querySelector('[name="bairro"]').value,
        municipio: document.querySelector('[name="municipio"]').value,
        estado: document.querySelector('[name="estado"]').value,
        contato: document.querySelector('[name="contato"]').value,
        telefone: document.querySelector('[name="telefone"]').value,
        email: document.querySelector('[name="email"]').value,
        produtos: [],
        anexos: []
    };

    for (let i = 1; i <= contadorProdutos; i++) {
        const produto = {
            produto: document.querySelector(`[name="produto-${i}"]`).value,
            unidadeMedida: document.querySelector(`[name="unidade-medida-${i}"]`).value,
            quantidadeEstoque: document.querySelector(`[name="qtd-estoque-${i}"]`).value,
            valorUnitario: document.querySelector(`[name="valor-unitario-${i}"]`).value,
            valorTotal: document.querySelector(`[name="valor-total-${i}"]`).value
        };
        fornecedor.produtos.push(produto);
    }

    for (let i = 1; i <= anexoCount; i++) {
        const anexo = {
            nome: `${arquivosAnexos[i]}`
        };
        fornecedor.anexos.push(anexo);
    }

    console.log(JSON.stringify(fornecedor, null, 2));
    setTimeout(() => {
        modal.style.display = 'none';
        alert('Dados enviados com sucesso!');
    }, 2000);
}

contarProduto(1);