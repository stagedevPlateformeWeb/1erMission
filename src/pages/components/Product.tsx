import { Html, Head, Main, NextScript } from 'next/document'
import styles from '../../styles/Home.module.css'
import Image from 'next/image'
import {Inter} from 'next/font/google'

import React from 'react'


interface ProductPageProps {
    title: string;
    price: number;
    description: string;
  }


export default function productPage(props:ProductPageProps){


    function addInCart(){
        

        const produit = {

            id:0,
            title: props.title,
            price : props.price
        }
        localStorage.setItem(produit.id.toString(),JSON.stringify(produit));
    }



    return (

        <main className={styles.main}>

        <h1 className={styles.title}>{props.title}</h1>

        <div className={styles.mainpicture}>
        <Image src="/product.jpg" alt="product" width={500} height={400}></Image>
        </div>

        <div>
          <h1 className={styles.title}>{props.price} euros</h1>
        </div>


        <div className={styles.description}>
            <label>Description</label>
            <p>
                {props.description}
            </p>
        </div>

        <div className={styles.valid}>
            <button className={styles.button}>
                    <label>Valid</label>
            </button>
            <button className={styles.button} onClick={addInCart}>
                <Image src="/bx-cart.svg" alt="cart" width={20} height={20}></Image>
            </button>

        </div>
        

      </main>

    );
   
}