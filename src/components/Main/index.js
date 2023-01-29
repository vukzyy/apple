import React, {useCallback, useEffect, useState} from 'react';

import axios from "axios";

import bem from "easy-bem";

import {SlBasket} from 'react-icons/sl'

import './style.scss'

const Main = () => {

    const [product, setProduct] = useState([])
    const [input, setInput] = useState('')
    const [category, setCategory] = useState('Categories')
    const [countProduct, setCountProduct] = useState(1)
    const [modal, setModal] = useState(false)
    const [basket, setBasket] = useState(false)
    const [count, setCount] = useState(0)
    const [total, setTotal] = useState([])
    const [bought, setBought] = useState([])

    const cn = bem('main')


    const axiosGet = () => {
        axios(`http://localhost:8080/catalog${category !== 'Categories' ? '?category=' + category : ''}`)
            .then(({data}) => setProduct(data))
            .catch((err) => console.log(err.message))
    }

    useEffect(() => {
        axios(`http://localhost:8080/catalog${input ? '?title_like=' + input : ''}`)
            .then(({data}) => setProduct(data))
            .catch((err) => console.log(err.message))
    }, [input])

    useEffect(() => {
        axios(`http://localhost:8080/catalog${category !== 'Categories' ? '?category=' + category : ''}`)
            .then(({data}) => setProduct(data))
            .catch((err) => console.log(err.message))
    }, [category])

    useEffect(() => {
        axiosGet()
    }, [count])

    useEffect(() => {
        axios(`http://localhost:8080/catalog?basket_like=true`)
            .then(({data}) => setBought(data))
            .catch((err) => console.log(err.message))
    }, [count], [])


    const inputValue = (e) => {
        setInput(e.target.value)
    }

    const categoryHandler = (e) => {
        let value = e.target.value;
        setCategory(value)
        setCountProduct(1)
    }

    const increase = () => {
        setCountProduct(countProduct + 1)
    }

    const degrease = () => {
        setCountProduct(countProduct - 1)
    }

    const modalFormHandler = (e) => {
        e.preventDefault()
        setCategory(e.target[3].value)
        axios.post(`http://localhost:8080/catalog`, {
            title: e.target[0].value,
            price: e.target[1].value,
            image: e.target[2].value,
            category: e.target[3].value,
            basket: false
        })

        e.target.reset()

        setModal(false)

        setCount(count + 1)

    }

    const deleteHandler = (e) => {
        axios.delete(`http://localhost:8080/catalog/${e}`)
            .then(res => console.log(res))
            .catch(err => console.log(err.message()))
        setCount(count + 1)
    }

    const basketHandler = (item) => {
        axios.patch(`http://localhost:8080/catalog/${item.id}`, {
            basket: true
        })


        setCount(count + 1)
    }

    const calculate = () => {
        let filtered = product.filter(elem => elem.basket === true)
            .map(cost => cost.price)
        let calculated = filtered.reduce((acc, rec) => acc + rec, 0)
        setTotal(calculated)
        setBasket(true)
    }




    return (
        <div className={cn()}>
            <div className={cn('headerBox')}>
                <div>
                    <SlBasket size={'30'} cursor='pointer'
                              onClick={() => calculate()}/>{bought.length}
                    <div className={cn(`basketOverlay animated ${basket ? 'show' : ''}`)}>
                        <div className={cn('basket')}>
                            <svg className={cn('modal-close')} viewBox='0 0 200 200' onClick={() => setBasket(false)}>
                                <title/>
                                <path
                                    d="M114,100l49-49a9.9,9.9,0,0,0-14-14L100,86,51,37A9.9,9.9,0,0,0,37,51l49,49L37,149a9.9,9.9,0,0,0,14,14l49-49,49,49a9.9,9.9,0,0,0,14-14Z"/>
                            </svg>
                            <h3 className={cn('basket-title')}>Basket</h3>
                            {
                                product.filter(item => item.basket === true).map(elem => (
                                    <div key={elem.id} className={cn('basket-item')}>
                                        <h5>{elem.title}</h5>
                                        <p>{elem.price}$</p>
                                    </div>
                                ))
                            }
                            <div className={cn('basket-totalBox')}>
                                <h4 className={cn('basket-total')}>Total</h4>
                                <p>{total}$</p>
                            </div>

                        </div>
                    </div>
                </div>

                <p className={cn('title')}>
                    <svg width="128" height="19" viewBox="0 0 128 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M15.9176 6.65625C15.4318 2.625 12.3807 0.306818 8.34091 0.306818C3.73011 0.306818 0.210227 3.5625 0.210227 9.27273C0.210227 14.9659 3.67045 18.2386 8.34091 18.2386C12.8153 18.2386 15.517 15.2642 15.9176 12.0511L12.1847 12.0341C11.8352 13.9006 10.3693 14.9744 8.40057 14.9744C5.75 14.9744 3.9517 13.0057 3.9517 9.27273C3.9517 5.64204 5.72443 3.57102 8.42614 3.57102C10.446 3.57102 11.9034 4.73864 12.1847 6.65625H15.9176ZM22.1264 10.4318C22.1349 8.74432 23.1662 7.75568 24.6491 7.75568C26.1236 7.75568 26.9929 8.7017 26.9844 10.3125V18H30.6151V9.66477C30.6236 6.59659 28.8168 4.73864 26.0895 4.73864C24.1037 4.73864 22.7741 5.67614 22.1776 7.21875H22.0241V0.545454H18.4957V18H22.1264V10.4318ZM39.4382 18.2557C42.6768 18.2557 44.8587 16.679 45.37 14.25L42.0121 14.0284C41.6456 15.0256 40.7081 15.5455 39.4979 15.5455C37.6825 15.5455 36.532 14.3438 36.532 12.392V12.3835H45.4467V11.3864C45.4467 6.9375 42.7536 4.73864 39.2933 4.73864C35.4411 4.73864 32.9439 7.47443 32.9439 11.5142C32.9439 15.6648 35.407 18.2557 39.4382 18.2557ZM36.532 10.1335C36.6087 8.64205 37.7422 7.44886 39.353 7.44886C40.9297 7.44886 42.0206 8.57386 42.0291 10.1335H36.532ZM53.7308 18.2557C57.2166 18.2557 59.407 16.2102 59.5774 13.2017H56.1513C55.9382 14.5994 55.0178 15.3835 53.7734 15.3835C52.0774 15.3835 50.978 13.9602 50.978 11.4545C50.978 8.98295 52.0859 7.56818 53.7734 7.56818C55.103 7.56818 55.9553 8.44602 56.1513 9.75H59.5774C59.424 6.72443 57.1314 4.73864 53.7138 4.73864C49.7422 4.73864 47.2876 7.49148 47.2876 11.5057C47.2876 15.4858 49.6996 18.2557 53.7308 18.2557ZM61.902 18H65.5327V13.8409L66.5128 12.7244L70.0838 18H74.3366L69.2315 10.5767L74.0895 4.90909H69.9219L65.7287 9.87784H65.5327V0.545454H61.902V18ZM85.1584 18.2472C87.093 18.2472 88.3459 17.4034 88.9851 16.1847H89.0874V18H92.5305V9.17045C92.5305 6.05114 89.8885 4.73864 86.9737 4.73864C83.8374 4.73864 81.7749 6.23864 81.272 8.625L84.63 8.89773C84.8771 8.02841 85.6527 7.3892 86.9567 7.3892C88.1925 7.3892 88.8999 8.01136 88.8999 9.08523V9.13636C88.8999 9.98011 88.005 10.0909 85.7294 10.3125C83.1385 10.5511 80.8118 11.4205 80.8118 14.3438C80.8118 16.9347 82.6612 18.2472 85.1584 18.2472ZM86.1982 15.7415C85.0817 15.7415 84.2805 15.2216 84.2805 14.2244C84.2805 13.2017 85.1243 12.6989 86.4027 12.5199C87.1953 12.4091 88.4908 12.2216 88.9254 11.9318V13.321C88.9254 14.6932 87.7919 15.7415 86.1982 15.7415ZM98.978 0.545454H95.3473V18H98.978V0.545454ZM112.778 8.64205C112.455 6.23011 110.511 4.73864 107.205 4.73864C103.855 4.73864 101.648 6.28977 101.656 8.8125C101.648 10.7727 102.884 12.0426 105.44 12.554L107.707 13.0057C108.849 13.2358 109.369 13.6534 109.386 14.3097C109.369 15.0852 108.526 15.6392 107.256 15.6392C105.96 15.6392 105.099 15.0852 104.878 14.0199L101.307 14.2074C101.648 16.7131 103.778 18.2557 107.247 18.2557C110.639 18.2557 113.068 16.5256 113.077 13.9432C113.068 12.0511 111.832 10.9176 109.293 10.3977L106.923 9.92045C105.705 9.65625 105.253 9.23864 105.261 8.60795C105.253 7.82386 106.139 7.3125 107.264 7.3125C108.526 7.3125 109.276 8.00284 109.455 8.84659L112.778 8.64205ZM121.278 18.2557C125.249 18.2557 127.721 15.5369 127.721 11.5057C127.721 7.44886 125.249 4.73864 121.278 4.73864C117.306 4.73864 114.835 7.44886 114.835 11.5057C114.835 15.5369 117.306 18.2557 121.278 18.2557ZM121.295 15.4432C119.462 15.4432 118.525 13.7642 118.525 11.4801C118.525 9.19602 119.462 7.50852 121.295 7.50852C123.093 7.50852 124.031 9.19602 124.031 11.4801C124.031 13.7642 123.093 15.4432 121.295 15.4432Z"
                            fill="#0C1014"/>
                    </svg>
                </p>
                <input type="text"
                       placeholder='Search product'
                       className={cn('input')}
                       onChange={(e) => inputValue(e)}
                />
                <button className={cn('newProduct')}
                        onClick={() => setModal(true)}>
                    Create product +
                </button>
                <div className={cn(`overlay animated ${modal ? 'show' : ''}`)}>
                    <div className={cn('modal')}>
                        <svg className={cn('modal-close')} viewBox='0 0 200 200' onClick={() => setModal(false)}>
                            <title/>
                            <path
                                d="M114,100l49-49a9.9,9.9,0,0,0-14-14L100,86,51,37A9.9,9.9,0,0,0,37,51l49,49L37,149a9.9,9.9,0,0,0,14,14l49-49,49,49a9.9,9.9,0,0,0,14-14Z"/>
                        </svg>
                        <h3 className={cn('modal-title')}>Create product</h3>
                        <form className={cn('modal-block')} onSubmit={(e) => modalFormHandler(e)}>
                            <input type="text" className={cn('modal-input')} maxLength='25' placeholder='Product name'/>
                            <input type="number" className={cn('modal-input number')} placeholder='Price'/>
                            <input type="text" className={cn('modal-input')} placeholder='image URL'/>
                            <select name="category" className={cn('select')}>
                                <option>Categories</option>
                                <option>Headphones</option>
                                <option>iphone</option>
                                <option>ipad</option>
                                <option>watch</option>
                                <option>mac</option>
                            </select>
                            <button className={cn('item-buy add')} type='submit'>
                                Add
                            </button>
                        </form>
                    </div>
                </div>
                <div>
                    <select name="category"
                            onChange={(e) => categoryHandler(e)}
                            className={cn('select')}>
                        <option>Categories</option>
                        <option>Headphones</option>
                        <option>iphone</option>
                        <option>ipad</option>
                        <option>watch</option>
                        <option>mac</option>
                    </select>
                </div>

            </div>
            <div className={cn('container')}>

                {
                    product.filter((elem, idx) => idx < 4 * countProduct)
                        .map((item) => (
                            <div className={cn('item')}
                                 key={item.id}>
                                <img src={item.image} alt="" className={cn('item-img')}/>
                                <p className={cn('item-title')}>
                                    {item.title}
                                </p>
                                <p className={cn('item-price')}>
                                    ${item.price}.00
                                </p>
                                <button onClick={() => basketHandler(item)}
                                        className={cn('item-buy')}>
                                    Buy
                                </button>
                                <button onClick={() => deleteHandler(item.id)}
                                        className={cn('item-buy delete')}>
                                    Delete
                                </button>
                            </div>
                        ))
                }
            </div>
            <div className={cn('container')}>
                <button className=
                            {cn(`more 
                            ${product.length <= 4 * countProduct ? 'disabled' : ''}`)}
                        onClick={() => increase()}
                        disabled={product.length <= 4 * countProduct}>
                    Показать еще
                </button>
                <button className=
                            {cn(`more ${countProduct === 1 ? 'disabled' : ''}`)}
                        onClick={() => degrease()}
                        disabled={countProduct === 1}
                >
                    Скрыть
                </button>
            </div>

        </div>
    );
};

export default Main;