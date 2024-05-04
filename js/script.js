const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-itens")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const addressWarm = document.getElementById("address-warm")
const removeItem = document.getElementById("remove-from-cart-btn")

let cart = [];

console.log(addressInput)

updateCartModal()
//Abrir modal
cartBtn.addEventListener("click", function(){
    updateCartModal();
    cartModal.style.visibility = "visible"
    checkoutBtn.style.transition = "200ms"
    removeItem.style.transition = "200ms"
    addressWarm.style.visibility = "hidden"
})

//Fechar modal quando clicar fora
cartModal.addEventListener("click", function(event){
    if(event.target === cartModal){
        cartModal.style.visibility = "hidden"
        checkoutBtn.style.transition = "0ms"
        removeItem.style.transition = "0ms"
        addressWarm.style.visibility = "hidden"
        verificaModal();
    }
})

//Fehcar modal botão
closeModalBtn.addEventListener("click", function(){
    cartModal.style.visibility = "hidden"
    checkoutBtn.style.transition = "0ms"
    removeItem.style.transition = "0ms"
    addressWarm.style.visibility = "hidden"
    verificaModal();
})

//Adicionando produto
//Pegando o botão e os dados nome e preço
menu.addEventListener("click", function(event){
    let parrentButton = event.target.closest(".add-to-cart-btn")

    if(parrentButton){
        const name = parrentButton.getAttribute("data-name")
        const price = parseFloat(parrentButton.getAttribute("data-price"))

        //Chamando função para adicionar ao carrinho
        addToCart(name, price)
    }

})

//função para adicionar no carrinho
function addToCart(name, price){
    //Percirrendo a lista procurando o item
    const existengItem = cart.find(item => item.name === name)

    Toastify({
        text: "Item adicionado com sucesso!",
        duration: 3000,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
            background: "#212529",
            boxShadow: "rgba(0, 0, 0, 0.468) 0px 5px 15px"
        },
    }
    ).showToast();

    //Se o item existir aumenta apenas a quantidade + 1
    if(existengItem){
        existengItem.quantity += 1;
    }else{
        cart.push({
            name,
            price,
            quantity: 1,
        })
    }

    updateCartModal();
}

//Atualizando o carrinho
function updateCartModal(){
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartElement = document.createElement("div");
        
        //Adicionando HTML do produto
        cartElement.innerHTML = `
        <div class = "container-item-produto">
            <div>
                <div class = "item-produto">
                    <h1>${item.name}</h1>
                    <p>Quantidade ${item.quantity}</p>
                    <h3>Valor: R$ ${item.price.toFixed(2)}</h3>
                </div>
            </div>

            <div class = "botao-remover">
                <button class = "remove-from-cart-btn" data-name = "${item.name}">Remover</button>
            </div>
        </div>
        `

        total += item.price * item.quantity

        cartItemsContainer.appendChild(cartElement)
    })

    //Adicionando total
    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    //Mudando quantidade do carrinho
    cartCounter.innerHTML = cart.length;
}

//Função remover do carrinho
cartItemsContainer.addEventListener("click", function (event){
    if(event.target.classList.contains("remove-from-cart-btn")){
        const name = event.target.getAttribute("data-name")

        removeItemCart(name);
    }

})

//Função para achar o item
function removeItemCart(name){
    const index = cart.findIndex(item => item.name === name);

    if(index !== -1){
        const item = cart[index];

    if(item.quantity > 1){
        item.quantity -= 1;
        updateCartModal();
        return;
    }

    cart.splice(index, 1);
    updateCartModal();

    }

}

//Pegando endereço
addressInput.addEventListener("input", function(event){
    let inputValue = event.target.value;

    if(inputValue !== ""){
        addressInput.style.border = "2px solid var(--cinza)"
        addressWarm.style.visibility = "hidden"
    }

    //Tendando remover o texto quando fechar o modal
    //if((cartModal.style.visibility = "hidden")){
        //addressInput.style.border = "2px solid var(--cinza)"
        //addressWarm.style.visibility = "hidden"
    //}
}) 

//Verificando os requisitos
checkoutBtn.addEventListener("click", function(){

    const isOpen = checkRestaurantOpen();
    if(!isOpen){
        Toastify({
            text: "Ops! o restaurante está fechado",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "#ef4444",
            },
        }
        ).showToast();
        //return;
    }

    if(cart.length === 0) return;
    
    if(addressInput.value === ""){
        addressWarm.style.visibility = "visible"
        addressInput.style.border = "2px solid red"
        return;
    }

    //Enviando para o Whatsapp
    const cartItens = cart.map((item) => {
        return(
            ` ${item.name} 
Quantidade: (${item.quantity}) 
Preço: R$ ${item.price}
----------------
`
        )
    }).join("")

    const mensage = encodeURIComponent(cartItens)
    const phone = "8188836598"

    window.open(`https://wa.me/${phone}?text=${mensage} Forma de pagamento: ${addressInput.value}`, "_blank")

    cart = [];
    updateCartModal();
})

//Verificando hora e manipulando card horario
function checkRestaurantOpen(){
    const data = new Date();
    const hora = data.getHours();
    return hora >= 19 && hora < 23.59 ; //True = restaurante aberto
}

const spanItem = document.getElementById("date-span")
const isOpen = checkRestaurantOpen();

if(isOpen){
    spanItem.style.backgroundColor = "var(--verde)"
}else{
    spanItem.style.backgroundColor = "var(--vermelho)"
}