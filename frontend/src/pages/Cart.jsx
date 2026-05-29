import React from 'react'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ShoppingCart, Trash2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import userLogo from "../assets/user.jpg"
import { setCart } from '@/redux/productSlice'
import {useEffect} from "react"

const Cart = () => {
  const { cart } = useSelector(store => store.product)

  const subtotal = cart?.totalPrice || 0
  const shipping = subtotal > 299 ? 0 : 10
  const tax = subtotal * 0.05
  const total = subtotal + shipping + tax
  const navigate = useNavigate()

  const API = "http://localhost:5000/api/v1/cart"
  const accessToken = localStorage.getItem("accessToken")
  const dispatch = useDispatch()

  const loadCart = async () => {
    try {
      const res = await axios.get(API, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      if (res.data.success) {
        dispatch(setCart(res.data.cart))
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleUpdateQuantity = async (productId, type) => {
    try {
      const res = await axios.put(`${API}/update`, { productId, type }, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      if (res.data.success) {
        dispatch(setCart(res.data.cart))
      }

    } catch (error) {
      console.log(error);
    }
  }

  const handleRemove = async (productId) => {
    try {
      const res = await axios.delete(`${API}/remove`, {
        headers: {
          Authorization: `Bearer ${accessToken}`

        },
        data: { productId }

      });
      if (res.data.success) {
        console.log(res.data.cart)
        dispatch(setCart(res.data.cart))
        toast.success('Product removed from cart')
      }
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    loadCart()
  }, [dispatch])


  return (
    <div className='pt-20 bg-gray-50 min-h-screen px-4'>

      {
        cart?.items?.length > 0 ? (

          <div className='max-w-6xl mx-auto'>

            {/* TITLE */}
            <h1 className='text-3xl font-bold text-gray-800 mb-6'>
              Shopping Cart
            </h1>

            <div className='flex flex-col lg:flex-row gap-5'>

              {/* LEFT SIDE */}
              <div className='flex flex-col gap-4 flex-1'>

                {
                  cart?.items?.map((product, index) => (

                    <Card
                      key={index}
                      className='px-4 py-3 bg-white rounded-2xl border shadow-sm'
                    >

                      <div className='flex items-center justify-between'>

                        {/* PRODUCT INFO */}
                        <div className='flex items-center gap-4 w-[42%]'>

                          <img
                            src={
                              product?.productId?.productImg?.[0]?.url ||
                              userLogo
                            }
                            alt='product'
                            className='w-16 h-16 object-cover rounded-md'
                          />

                          <div>

                            <h1 className='font-semibold text-sm line-clamp-1 leading-tight text-gray-900'>
                              {product?.productId?.productName}
                            </h1>

                            <p className='text-sm text-gray-600 mt-1'>
                              ₹{product?.productId?.productPrice}
                            </p>

                          </div>
                        </div>

                        {/* QUANTITY */}
                        <div className='flex items-center gap-2'>

                          <Button onClick={() => handleUpdateQuantity(product.productId._id, 'decrease')}
                            variant='outline'
                            className='h-8 w-8 p-0 text-base'
                          >
                            -
                          </Button>

                          <span className='text-sm font-medium w-4 text-center'>
                            {product?.quantity}
                          </span>

                          <Button onClick={() => handleUpdateQuantity(product.productId._id, 'increase')}
                            variant='outline'
                            className='h-8 w-8 p-0 text-base'
                          >
                            +
                          </Button>

                        </div>

                        {/* PRICE */}
                        <div className='font-semibold text-sm w-[14%] text-center'>
                          ₹
                          {(
                            product?.productId?.productPrice *
                            product?.quantity
                          ).toLocaleString("en-IN")}
                        </div>

                        {/* REMOVE */}
                        <div onClick={() => handleRemove(product?.productId?._id)} className='text-red-500 flex items-center gap-1 text-sm cursor-pointer hover:text-red-600'>

                          <Trash2 className='w-4 h-4' />

                          <span>Remove</span>

                        </div>

                      </div>

                    </Card>

                  ))
                }

              </div>

              {/* RIGHT SIDE */}
              <div>

                <Card className='w-[360px] bg-white rounded-2xl shadow-sm border'>

                  <CardHeader>
                    <CardTitle className='text-2xl font-bold'>
                      Order Summary
                    </CardTitle>
                  </CardHeader>

                  <CardContent className='space-y-4 text-sm'>

                    {/* SUBTOTAL */}
                    <div className='flex justify-between'>
                      <span>
                        Subtotal ({cart?.items?.length} items)
                      </span>

                      <span>
                        ₹{subtotal.toLocaleString("en-IN")}
                      </span>
                    </div>

                    {/* SHIPPING */}
                    <div className='flex justify-between'>
                      <span>Shipping</span>

                      <span>
                        ₹{shipping}
                      </span>
                    </div>

                    {/* TAX */}
                    <div className='flex justify-between'>
                      <span>Tax (5%)</span>

                      <span>
                        ₹{tax.toLocaleString("en-IN")}
                      </span>
                    </div>

                    <div className='border-t border-gray-200'></div>

                    {/* TOTAL */}
                    <div className='flex justify-between font-bold text-2xl pt-2'>

                      <span>Total</span>

                      <span>
                        ₹{total.toLocaleString("en-IN")}
                      </span>

                    </div>

                    {/* PROMO */}
                    <div className='space-y-3 pt-3'>

                      <div className='flex gap-2'>

                        <Input
                          placeholder='Promo Code'
                          className='h-10 text-sm'
                        />

                        <Button
                          variant='outline'
                          className='h-10 text-sm'
                        >
                          Apply
                        </Button>

                      </div>

                      {/* PLACE ORDER */}
                      <Button onClick={()=>navigate('/address')} className='w-full bg-pink-600 hover:bg-pink-700 h-10 text-sm'>

                        PLACE ORDER

                      </Button>

                      {/* CONTINUE SHOPPING */}
                      <Button
                        variant='outline'
                        className='w-full h-10 text-sm bg-transparent'
                      >

                        <Link to="/products">
                          Continue Shopping
                        </Link>

                      </Button>

                    </div>

                    {/* INFO */}
                    <div className='text-sm text-gray-400 pt-4 space-y-1'>

                      <p>* Free shipping on orders over 299</p>

                      <p>* 30-days return policy</p>

                      <p>* Secure checkout with SSL encryption</p>

                    </div>

                  </CardContent>

                </Card>

              </div>

            </div>

          </div>

        ) : (

          <div className='flex flex-col items-center justify-center min-h-[60vh] p-6 text-center'>

            <div className='bg-pink-100 p-6 rounded-full'>
              <ShoppingCart className='w-16 h-16 text-pink-600' />
            </div>
            <h2 className='mt-6 text-2xl font-bold text-gray-800'>Your Cart is Empty</h2>
            <p className='mt-2 text-gray-600'>Looks like you haven't added anything to your cart yet</p>
            <Button onClick={() => navigate('/products')} className='mt-6 cursor-pointer bg-pink-600 text-white py-3 px-6 hover:bg-pink-700'>Start Shopping</Button>

          </div>

        )
      }

    </div>
  )
}

export default Cart