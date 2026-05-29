import React from 'react'
import { Button } from '@/components/ui/button'
import { ArrowBigLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'


const OrderCard = ({userOrder}) => {
    const navigate = useNavigate()
  return (
    <div className='max-w-4xl mx-auto py-24 px-4 flex flex-col gap-6'>
            <div className='w-full'>

                {/* Header */}
                <div className='flex items-center gap-4 mb-6'>
                    <Button
                        onClick={() => navigate(-1)}
                        className='bg-black text-white'
                    >
                        <ArrowBigLeft />
                    </Button>

                    <h1 className='text-2xl font-bold'>
                        Orders
                    </h1>
                </div>

                {/* No Orders */}
                {
                    userOrder?.length === 0 ? (
                        <p className='text-gray-800 text-2xl'>
                            No Orders found for this user
                        </p>
                    ) : (

                        /* Orders List */
                        <div className='space-y-6 w-full'>

                            {
                                userOrder?.map((order) => (

                                    <div
                                        key={order._id}
                                        className='shadow-lg rounded-2xl p-5 border border-gray-200 bg-white'
                                    >

                                        {/* Order Header */}
                                        <div className='flex justify-between items-center mb-4'>

                                            <h2 className='text-lg font-semibold'>
                                                Order ID:{" "}

                                                <span className='text-gray-600 break-all'>
                                                    {order._id}
                                                </span>
                                            </h2>

                                            <p className='text-sm text-gray-500'>
                                                Amount:{" "}

                                                <span className='font-bold'>
                                                    {order.currency}{" "}
                                                    {order.amount?.toFixed(2)}
                                                </span>
                                            </p>
                                        </div>

                                        {/* User Info */}
                                        <div className='flex justify-between items-center'>

                                            <div className='mb-4'>
                                                <p className='text-sm text-gray-700'>
                                                    <span className='font-medium'>
                                                        User:
                                                    </span>{" "}

                                                    {order.user?.firstName || "Unknown"}{" "}
                                                    {order.user?.lastName || ""}
                                                </p>

                                                <p className='text-sm text-gray-500'>
                                                    Email:{" "}
                                                    {order.user?.email || "N/A"}
                                                </p>
                                            </div>

                                            {/* Status */}
                                            <span
                                                className={`
                                                px-3 py-1 rounded-lg text-white text-sm font-medium
                                                ${order.status === "Paid"
                                                        ? "bg-green-500"
                                                        : order.status === "Failed"
                                                            ? "bg-red-500"
                                                            : "bg-orange-400"
                                                    }
                                            `}
                                            >
                                                {order.status}
                                            </span>
                                        </div>

                                        {/* Products */}
                                        <div className='mt-4 space-y-3'>

                                            {
                                                order.products?.map((item, index) => (

                                                    <div
                                                        key={index}
                                                        className='flex items-center gap-4 border rounded-lg p-3'
                                                    >

                                                        <img onClick={()=> navigate(`/products/${item?.productId?._id}`)}
                                                            src={item.productId?.productImg?.[0]?.url}
                                                            alt=""
                                                            className='w-20 h-20 object-cover rounded-md cursor-pointer'
                                                        />

                                                        <div className='flex-1'>
                                                            <h3 className='font-semibold'>
                                                                {item.productId?.productName}
                                                            </h3>

                                                            <p className='text-sm text-gray-500'>
                                                                Quantity: {item.quantity}
                                                            </p>

                                                            <p className='font-bold'>
                                                                ₹{item.productId?.productPrice}
                                                            </p>
                                                        </div>

                                                    </div>
                                                ))
                                            }
                                        </div>

                                    </div>
                                ))
                            }

                        </div>
                    )
                }

            </div>
        </div>
  )
}

export default OrderCard