import { Input } from '@/components/ui/input'
import { Edit, Eye, Search } from 'lucide-react'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios'
import UserLogo from '../../assets/user.jpg'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

const AdminUsers = () => {
  const [users, setUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()
  const getAllUsers = async () => {
    const accessToken = localStorage.getItem("accessToken")
    try {
      const res = await axios.get(`http://localhost:5000/api/v1/user/all-user`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      if (res.data.success) {
        setUsers(res.data.users)
      }

    } catch (error) {
      console.log(error)
    }
  }


  const filteredUsers = users.filter(user =>
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  useEffect(() => {
    getAllUsers()
  }, [])

  return (
    <div className='pl-[320px] py-20 pr-10 px-4'>
      <h1 className='font-bold text-2xl'>User Management</h1>
      <p>View and manage registered users</p>
      <div className='flex relative w-[300px] mt-6'>
        <Search className='absolute left-2 top-1 text-gray-600 w-5' />
        <Input
          className='pl-10'
          placeholder="Search Users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className='grid grid-cols-2 gap-7 mt-7'>
        {
          filteredUsers.map((user, index) => {
            return (
              <div
                key={index}
                className='bg-pink-100 p-5 rounded-lg w-full'
              >
                <div className='flex items-center gap-4'>
                  <img
                    src={user?.profilePic || UserLogo}
                    alt=""
                    className='rounded-full w-16 h-16 object-cover border border-pink-600'
                  />

                  <div>
                    <h1 className='font-semibold text-lg'>
                      {user?.firstName} {user?.lastName}
                    </h1>

                    <h3 className='text-gray-700'>
                      {user?.email}
                    </h3>
                  </div>
                </div>
                <div className='flex gap-3 mt-3'>
                  <Button
                    className='bg-white'
                    onClick={() => navigate(`/dashboard/users/${user._id}`)} variant='outline'
                  >
                    <Edit />
                    Edit
                  </Button>
                  <Button onClick={()=>navigate(`/dashboard/users/orders/${user?._id}`)} className='bg-black text-white'>
                    <Eye />
                    Show Order
                  </Button>
                </div>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

export default AdminUsers