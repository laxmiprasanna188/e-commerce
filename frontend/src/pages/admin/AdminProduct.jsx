import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { Button } from "@/components/ui/button"

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Label } from "@/components/ui/label"

import { Edit, Search, Trash2 } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import ImageUpload from '@/components/ImageUpload'
import axios from 'axios'
import { toast } from 'sonner'
import { setProducts } from '@/redux/productSlice'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const AdminProduct = () => {
  const { products } = useSelector(store => store.product)

  const [editProduct, setEditProduct] = useState(null)
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortOrder, setSortedOrder] = useState("")

  const accessToken = localStorage.getItem("accessToken")

  const dispatch = useDispatch()
  let filteredProducts = products.filter((product) =>
    product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  )


  if (sortOrder === "lowToHigh") {
    filteredProducts = [...filteredProducts].sort((a, b) => a.productPrice - b.productPrice)
  }
  if (sortOrder === "highToLow") {
    filteredProducts = [...filteredProducts].sort((a, b) => b.productPrice - a.productPrice)
  }

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target

    setEditProduct((prev) => ({
      ...prev,
      [name]: value,
    }))
  }



  // Handle Save
  const handleSave = async (e) => {
    e.preventDefault()

    try {
      const formData = new FormData()

      formData.append("productName", editProduct.productName)
      formData.append("productDesc", editProduct.productDesc)
      formData.append("productPrice", editProduct.productPrice)
      formData.append("category", editProduct.category)
      formData.append("brand", editProduct.brand)

      // Existing Images
      const existingImages = editProduct.productImg
        .filter((img) => !(img instanceof File) && img.public_id)
        .map((img) => img.public_id)

      formData.append(
        "existingImages",
        JSON.stringify(existingImages)
      )

      // New Uploaded Images
      editProduct.productImg
        .filter((img) => img instanceof File)
        .forEach((file) => {
          formData.append("files", file)
        })

      const res = await axios.put(
        `http://localhost:5000/api/v1/product/update/${editProduct._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      )

      if (res.data.success) {
        toast.success("Product updated successfully")

        const updatedProducts = products.map((p) =>
          p._id === editProduct._id ? res.data.product : p
        )

        dispatch(setProducts(updatedProducts))
        setOpen(false)
      }
    } catch (error) {
      console.log(error)
      toast.error("Something went wrong")
    }
  }
  const deleteProductHandler = async (productId) => {
    try {
      const remainingProducts = products.filter((product) => product._id !== productId)
      const res = await axios.delete(`http://localhost:5000/api/v1/product/delete/${productId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      if (res.data.success) {
        toast.success(res.data.message)
        dispatch(setProducts(remainingProducts))
      }
    } catch (error) {
      console.log(error)
      toast.error("Something went wrong")
    }
  }

  return (
    <div className='pl-[350px] py-20 pr-20 flex flex-col gap-5 min-h-screen bg-gray-100'>

      {/* Top Section */}
      <div className='flex justify-between'>

        {/* Search */}
        <div className='relative bg-white rounded-lg'>
          <Input
            type='text'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder='Search Product...'
            className='w-[400px] h-11'
          />

          <Search
            className='absolute right-3 top-3 text-gray-500 w-5 h-5' />
        </div>

        {/* Sort */}
        <Select onValueChange={(value) => setSortedOrder(value)}>
          <SelectTrigger className='w-[220px] bg-white h-11'>
            <SelectValue placeholder='Sort by Price' />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value='lowToHigh'>
              Price: Low to High
            </SelectItem>

            <SelectItem value='highToLow'>
              Price: High to Low
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Products */}
      {
        filteredProducts.map((product, index) => {
          return (
            <Card
              key={index}
              className='px-5 py-4 bg-white rounded-xl shadow-sm'
            >

              <div className='flex items-center justify-between'>

                {/* Left */}
                <div className='flex gap-4 items-center'>
                  <img
                    src={product.productImg[0].url}
                    alt=""
                    className='w-[90px] h-[90px] object-cover rounded-lg border'
                  />

                  <h1 className='font-semibold w-96 text-gray-700 text-[16px]'>
                    {product.productName}
                  </h1>
                </div>

                {/* Price */}
                <h1 className='font-bold text-gray-800 text-lg'>
                  ₹{product.productPrice}
                </h1>

                {/* Actions */}
                <div className='flex gap-4'>

                  {/* Edit Dialog */}
                  <Dialog open={open} onOpenChange={setOpen}>

                    <DialogTrigger asChild>
                      <button onClick={() => { setOpen(true), setEditProduct(product) }}>
                        <Edit className='text-green-500 cursor-pointer' />
                      </button>
                    </DialogTrigger>

                    <DialogContent className="sm:max-w-[700px] bg-white max-h-[90vh] overflow-y-auto rounded-xl px-6 py-6">

                      {/* Header */}
                      <DialogHeader className='space-y-1'>
                        <DialogTitle className='text-2xl font-semibold text-gray-800'>
                          Edit Product
                        </DialogTitle>

                        <DialogDescription className='text-sm text-gray-500'>
                          Make changes to your product here. Click save when you're done.
                        </DialogDescription>
                      </DialogHeader>

                      {/* Form */}
                      <div className='flex flex-col gap-5 mt-4'>

                        {/* Product Name */}
                        <div className='flex flex-col gap-2'>
                          <Label className='text-[15px] font-semibold text-gray-700'>
                            Product Name
                          </Label>

                          <Input
                            type='text'
                            value={editProduct?.productName}
                            onChange={handleChange}
                            name='productName'
                            placeholder='Ex-Iphone'
                            className='h-11 text-[15px]'
                            required
                          />
                        </div>

                        {/* Price */}
                        <div className='flex flex-col gap-2'>
                          <Label className='text-[15px] font-semibold text-gray-700'>
                            Price
                          </Label>

                          <Input
                            type='number'
                            value={editProduct?.productPrice}
                            onChange={handleChange}
                            name='productPrice'
                            placeholder='Ex-1000'
                            className='h-11 text-[15px]'
                            required
                          />
                        </div>

                        {/* Brand + Category */}
                        <div className='grid grid-cols-2 gap-4'>

                          {/* Brand */}
                          <div className='flex flex-col gap-2'>
                            <Label className='text-[15px] font-semibold text-gray-700'>
                              Brand
                            </Label>

                            <Input
                              type='text'
                              value={editProduct?.brand}
                              onChange={handleChange}
                              name='brand'
                              placeholder='Ex-Apple'
                              className='h-11 text-[15px]'
                              required
                            />
                          </div>

                          {/* Category */}
                          <div className='flex flex-col gap-2'>
                            <Label className='text-[15px] font-semibold text-gray-700'>
                              Category
                            </Label>

                            <Input
                              type='text'
                              value={editProduct?.category}
                              onChange={handleChange}
                              name='category'
                              placeholder='Ex-Electronics'
                              className='h-11 text-[15px]'
                              required
                            />
                          </div>
                        </div>

                        {/* Description */}
                        <div className='flex flex-col gap-2'>

                          <Label className='text-[15px] font-semibold text-gray-700'>
                            Description
                          </Label>

                          <Textarea
                            name='productDesc'
                            placeholder='Enter brief description of product'
                            value={editProduct?.productDesc}
                            onChange={handleChange}
                            className='min-h-[220px] resize-none text-[15px] leading-7 text-gray-700'
                          />
                        </div>

                        {/* Images */}
                        <div className='flex flex-col gap-3'>
                          <h1 className='font-semibold text-gray-800 text-[15px]'>

                          </h1>

                          <ImageUpload
                            productData={editProduct}
                            setProductData={setEditProduct}
                          />
                        </div>

                      </div>

                      {/* Footer */}
                      <DialogFooter className='mt-5'>

                        <DialogClose asChild>
                          <Button
                            type="button"
                            variant='outline'
                            className='px-6'
                          >
                            Cancel
                          </Button>
                        </DialogClose>

                        <Button
                          onClick={handleSave}
                          type='submit'
                          className='bg-black hover:bg-gray-800 text-white px-6'
                        >
                          Save changes
                        </Button>

                      </DialogFooter>

                    </DialogContent>

                  </Dialog>

                  {/* Delete */}
                  <AlertDialog className='bg-white'>
                    <AlertDialogTrigger>
                      <Trash2 className='text-red-500 cursor-pointer' />
                    </AlertDialogTrigger>

                    <AlertDialogContent className='bg-white'>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>

                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete your account and remove your data from our
                          servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>

                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction className='bg-black text-white' onClick={() => deleteProductHandler(product._id)}>Continue</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>


                </div>

              </div>

            </Card>
          )
        })
      }

    </div>
  )
}

export default AdminProduct