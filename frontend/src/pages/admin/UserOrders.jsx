import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

import OrderCard from '@/components/OrderCard'

const UserOrders = () => {

    const params = useParams()

    const [userOrder, setUserOrder] = useState([])

    const getUserOrders = async () => {

        try {

            const accessToken = localStorage.getItem("accessToken")

            const res = await axios.get(
                `${import.meta.env.VITE_URL}/api/v1/orders/user-order/${params.userId}`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }
            )

            console.log(res.data)

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
        <div className='pl-[350px] py-20'>
            <OrderCard userOrder={userOrder} dashboard={true} />
        </div>
    )
}

export default UserOrders