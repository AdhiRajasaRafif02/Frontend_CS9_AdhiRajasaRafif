import { useEffect, useState } from "react"
import { toast } from 'react-toastify'

function Cart() {
  const [transactions, setTransactions] = useState([])
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCartAndUser = async () => {
      const localUser = JSON.parse(localStorage.getItem("user"))
      if (!localUser) {
        toast.error("Silakan login terlebih dahulu")
        return
      }

      try {
        // 🔹 Ambil user terbaru dari backend
        const userRes = await fetch(`http://localhost:3000/user/byEmail/${localUser.email}`)
        const userData = await userRes.json()
        setUser(userData.payload)

        // 🔹 Ambil transaksi dari backend
        const trxRes = await fetch("http://localhost:3000/transaction/")
        const trxData = await trxRes.json()

        const filtered = trxData.payload.filter(
          (t) => t.user_id === localUser.id && t.status === "pending"
        )
        setTransactions(filtered)
      } catch (err) {
        console.error("Gagal memuat data:", err)
        toast.error("Terjadi kesalahan saat memuat keranjang")
      } finally {
        setLoading(false)
      }
    }

    fetchCartAndUser()
  }, [])

  const handlePay = async (transactionId) => {
    try {
      const res = await fetch(`http://localhost:3000/transaction/pay/${transactionId}`, {
        method: "POST"
      })
      const data = await res.json()

      if (res.ok) {
        toast.success("Pembayaran berhasil!")
        setTransactions((prev) => prev.filter((t) => t.id !== transactionId))

        // 🔄 Refresh saldo user
        const userRes = await fetch(`http://localhost:3000/user/byEmail/${user.email}`)
        const userData = await userRes.json()
        setUser(userData.payload)
      } else {
        toast.error(data.message || "Gagal membayar")
      }
    } catch (err) {
      console.error("Error saat membayar:", err)
      toast.error("Terjadi kesalahan saat memproses pembayaran")
    }
  }

  if (loading) return <div className="p-4">Loading...</div>

  if (transactions.length === 0) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-2">Keranjang</h1>
        {user && (
          <p className="text-gray-600 mb-4">
            Saldo Anda: <span className="font-semibold text-black">Rp {user.balance.toLocaleString()}</span>
          </p>
        )}
        <p>Keranjang kamu kosong.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-xl font-semibold text-center text-gray-800 mb-6">Keranjang</h1>
  
        {user && (
          <p className="text-sm text-center text-gray-500 mb-6">
            Saldo: <span className="text-gray-800 font-medium">Rp {user.balance.toLocaleString()}</span>
          </p>
        )}
  
        {transactions.length === 0 ? (
          <p className="text-center text-gray-400">Keranjang kamu kosong.</p>
        ) : (
          <div className="space-y-4">
            {transactions.map((trx) => (
              <div
                key={trx.id}
                className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 flex flex-col sm:flex-row sm:items-center gap-4"
              >
                <img
                  src={trx.item.image_url}
                  alt={trx.item.name}
                  className="w-full sm:w-32 h-32 object-cover rounded-md"
                />
                <div className="flex-1">
                  <h2 className="text-sm font-semibold text-gray-800">{trx.item.name}</h2>
                  <p className="text-xs text-gray-500">Jumlah: {trx.quantity}</p>
                  <p className="text-xs text-gray-500">Harga: Rp {trx.item.price.toLocaleString()}</p>
                  <p className="text-sm font-medium text-gray-800 mt-1">
                    Total: Rp {trx.total.toLocaleString()}
                  </p>
                </div>
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1.5 rounded-md transition"
                  onClick={() => handlePay(trx.id)}
                >
                  Bayar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Cart
