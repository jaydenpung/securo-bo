import React from 'react'
import Link from 'next/link'
import styles from './NavBar.module.scss'
const Navbar = () => {
    return (
        <nav className={styles.navbar}>
            <ul>
                <Link href='/'><a><li>Home</li></a></Link>
                <Link href='/customer'><a><li>Customer List</li></a></Link>
                <Link href='/fund'><a><li>Fund List</li></a></Link>
            </ul>
        </nav>
    )
}
 
export default Navbar