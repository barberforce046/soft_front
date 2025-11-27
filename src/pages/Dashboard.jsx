import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { FaCut, FaSignOutAlt, FaPlus } from 'react-icons/fa';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const [cuts, setCuts] = useState([]);
    const [price, setPrice] = useState('');
    const [clientName, setClientName] = useState('');
    const [type, setType] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCuts();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/cuts', {
                clientName,
                price: Number(price),
                type,
                description
            });
            setClientName('');
            setPrice('');
            setType('');
            setDescription('');
            fetchCuts();
        } catch (err) {
            console.error(err);
            alert('Error adding cut');
        }
    };

    return (
        <div className="container">
            <div className="header flex justify-between items-center mb-4">
                <h2>Dashboard</h2>
                <div className="flex items-center gap-2">
                    <span>Welcome, {user?.name}</span>
                    <button onClick={logout} className="btn btn-secondary flex items-center gap-2">
                        <FaSignOutAlt /> Logout
                    </button>
                </div>
            </div>

            <div className="grid" style={{ gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
                {/* Add Cut Form */}
                <div className="card">
                    <h3 className="mb-4 flex items-center gap-2"><FaPlus /> New Cut</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Client Name</label>
                            <input
                                type="text"
                                value={clientName}
                                onChange={(e) => setClientName(e.target.value)}
                                required
                                placeholder="Client Name"
                            />
                        </div>
                        <div className="form-group">
                            <label>Price (COP)</label>
                            <input
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                required
                                placeholder="0"
                            />
                        </div>
                        <div className="form-group">
                            <label>Type</label>
                            <select
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                required
                            >
                                <option value="">Select Type</option>
                                <option value="Haircut">Haircut</option>
                                <option value="Beard">Beard</option>
                                <option value="Full Service">Full Service</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows="3"
                                placeholder="Details..."
                            ></textarea>
                        </div>
                        <button type="submit" className="btn btn-primary w-full">
                            <FaCut /> Record Cut
                        </button>
                    </form>
                </div>

                {/* Cuts List */}
                <div>
                    <h3 className="mb-4">Recent Cuts</h3>
                    {loading ? (
                        <p>Loading...</p>
                    ) : cuts.length === 0 ? (
                        <div className="card text-center" style={{ padding: '40px' }}>
                            <p style={{ color: 'var(--text-secondary)' }}>No cuts recorded yet.</p>
                        </div>
                    ) : (
                        <div className="grid">
                            {cuts.map((cut) => (
                                <div key={cut._id} className="card flex justify-between items-center">
                                    <div>
                                        <h4 style={{ fontSize: '1.1rem', marginBottom: '5px' }}>{cut.clientName || 'Client'} - {cut.type}</h4>
                                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
                                            {new Date(cut.date).toLocaleDateString()} - {cut.description || 'No description'}
                                        </p>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <span style={{ color: 'var(--secondary)', fontWeight: 'bold', fontSize: '1.2rem' }}>
                                            ${cut.price.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
