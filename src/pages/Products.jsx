import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { FiShoppingCart } from 'react-icons/fi'

function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch('https://backend-cs-9-adhi-rajasa-rafif-bay.vercel.app/item')
        const data = await res.json()
        setProducts(data.payload || [])
        setLoading(false)
      } catch (err) {
        console.error('Error fetching products:', err)
        toast.error("Gagal memuat produk")
        setLoading(false)
      }
    }

    fetchItems()
  }, [])

  const handleAddToCart = async (itemId) => {
    const user = JSON.parse(localStorage.getItem("user"))
    if (!user) {
      toast.error("Silakan login terlebih dahulu")
      return
    }

    const payload = {
      user_id: user.id,
      item_id: itemId,
      quantity: 1
    }

    try {
      const res = await fetch("https://backend-cs-9-adhi-rajasa-rafif-bay.vercel.app/transaction/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      })

      const data = await res.json()
      if (res.ok) {
        toast.success("Barang berhasil ditambahkan ke keranjang!")
      } else {
        toast.error(data.message || "Gagal menambahkan ke keranjang")
      }
    } catch (error) {
      console.error("Gagal tambah ke keranjang:", error)
      toast.error("Terjadi kesalahan saat menambahkan")
    }
  }

  if (loading) return <div className="p-4">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <h1 className="text-xl font-semibold text-center text-gray-800 mb-6">Daftar Produk</h1>
  
      <div className="max-w-6xl mx-auto px-4">
        {products.length === 0 ? (
          <p className="text-center text-gray-500 text-sm">Tidak ada produk tersedia.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition p-3 flex flex-col"
              >
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-full h-32 object-contain rounded-md bg-white mb-3"
                />
                <div className="flex-1">
                  <h2 className="text-sm font-medium text-gray-800 mb-1 truncate">{item.name}</h2>
                  <p className="text-xs text-gray-600 mb-1">Rp {item.price.toLocaleString()}</p>
                  <p className="text-xs text-gray-400 mb-3">Stok: {item.stock}</p>
                </div>
                <button
                  onClick={() => handleAddToCart(item.id)}
                  className="w-full flex items-center justify-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-xs py-1.5 rounded-md transition"
                >
                  <FiShoppingCart className="text-sm" />
                  Tambah
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )  
}

export default Products
