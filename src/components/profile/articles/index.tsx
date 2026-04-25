import { Add } from '@mui/icons-material';
import { Button, Pagination } from '@mui/material';
import React, { JSX, useEffect, useState } from 'react';
import FashionWeekForm from './add';
import { instance } from '../../../utils/axios';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';

interface Item {
  id: string;   // uuid
  name: string;
  image_url: string;
}

const Outfits: React.FC = (): JSX.Element => {
  const [items, setItems] = useState<Item[]>([]);
  const [showHello, setShowHello] = useState(false);
  const [loading, setLoading] = useState(true);

  const { getTokens, setTokens } = useAuth();
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  const fetchOutfits = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/users/outfit', {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) throw new Error();

      const data = await response.json();

      const fetchedItems: Item[] = data.map((outfit: any) => ({
        id: outfit.id,
        name: outfit.name,
        // фото первого предмета из образа, если есть
        image_url: outfit.items?.[0]?.image ?? '',
      }));

      setItems(fetchedItems);
    } catch (error) {
      console.error('Ошибка при загрузке образов:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOutfits();
  }, []);

  const handleaddItem = () => {
    setShowHello(!showHello);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/users/outfit/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.status !== 204) throw new Error();

      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch {
      console.error('Ошибка при удалении образа');
    }
  };

  const paginatedItems = items.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <div className='outfitsMain'>
      {showHello ? (
        <FashionWeekForm />
      ) : (
        <>
          <div className='articlesItems'>
            {paginatedItems.map((item) => (
              <div
                className='item'
                key={item.id}
                onClick={() => navigate(`/outfit/${item.id}`)}
                style={{ cursor: 'pointer' }}
              >
                <div className="imageContainer">
                  <img src={item.image_url} alt={item.name} />

                  <span
                    className="deleteIcon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(item.id);
                    }}
                  >
                    <DeleteIcon />
                  </span>
                </div>

                <p>{item.name}</p>
              </div>
            ))}
          </div>

          <div className="paginationContainer">
            <Pagination
              count={Math.ceil(items.length / itemsPerPage)}
              page={page}
              onChange={(_, value) => setPage(value)}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Outfits;