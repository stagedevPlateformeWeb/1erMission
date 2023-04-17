import Product from "product";



let autoincrement = 0;


const validButton = document.getElementById("button-valid");
const cartButton  =  document.getElementById("button-cart");



cartButton.addEventListener("click",()=>{

    const product = new Product(++autoincrement,"produit",10);

    localStorage.setItem(product.id,product);
    console.log("Element ajouter");
});

console.log(localStorage.getItem("1"));