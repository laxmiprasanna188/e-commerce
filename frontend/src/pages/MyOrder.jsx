
import { Button } from '@/components/ui/button'
import { ArrowBigLeft } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import OrderCard from '@/components/OrderCard'


const MyOrder = ({}) => {
    const navigate = useNavigate()

    const [userOrder, setUserOrder] = useState([])

    const getUserOrders = async () => {
        try {
            const accessToken = localStorage.getItem("accessToken")

            const res = await axios.get(
                `${import.meta.env.VITE_URL}/api/v1/orders/myorder`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }
            )

            console.log("Orders Response:", res.data)

            if (res.data.success) {
                setUserOrder(res.data.orders)
            }

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getUserOrders()
    }, [])

    return (
        <>
        <OrderCard userOrder={userOrder}/>
        </>
    )
}

export default MyOrder