import Head from 'next/head'
import { Inter } from 'next/font/google'
import Product from './components/Product'
import styles from '@/styles/Home.module.css'
import Image from 'next/image'
import Link from 'next/link'
import {useRouter} from 'next/router'


const inter = Inter({ subsets: ['latin'] })

export default function Home() {

  const router = useRouter();
  const {name} = router.query;


  function routing(){
    router.push('/clientSpace')
  }


  return (
    <>
      <Head>
        <header className={styles.header}>

        <div className={styles.leftHeader}>
            <h1 className={styles.title}>E-Commerce</h1>
        </div>

        <div className={styles.rightHeader}>
        
            <button className={styles.button}>
                <Image src="/bx-cart.svg" alt="cart" width={20} height={20}></Image>
            </button>
            <button className={styles.button} onClick={routing}>
                <Image src="/bx-user.svg" alt="user" width={20} height={20}></Image>
            </button>
        </div>
        </header>
      </Head>


      <Product title="test" price={10} description="lorem Ipsum"></Product> 
    </>
  )
}
