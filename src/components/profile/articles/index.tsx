import { Button, Pagination } from '@mui/material';
import React, { JSX, useEffect, useState } from 'react';
import FashionWeekForm from './add';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import { instance } from '../../../utils/axios';

interface OutfitItem {
  id: string;
  name: string;
  image: string;
  material: string;
}

interface Outfit {
  id: string;
  name: string;
  items: OutfitItem[];
}

const Outfits: React.FC = (): JSX.Element => {
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [showHello, setShowHello] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  const fetchOutfits = async () => {
      try {
          const response = await instance.get('/api/v1/users/outfit');
          setOutfits(response.data);
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
          await instance.delete(`/api/v1/users/outfit/${id}`);
          setOutfits((prev) => prev.filter((o) => o.id !== id));
      } catch {
          console.error('Ошибка при удалении образа');
      }
  };

  const handleClick = (outfit: Outfit) => {
    // прокидываем items конкретного образа — новый запрос не нужен
    navigate(`/outfit/${outfit.id}`, { state: { items: outfit.items } });
  };

  const paginatedOutfits = outfits.slice(
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
            {paginatedOutfits.map((outfit) => (
              <div
                className='item'
                key={outfit.id}
                onClick={() => handleClick(outfit)}
                style={{ cursor: 'pointer' }}
              >
                <div className="imageContainer">
                  <img src={outfit.items?.[0]?.image ?? ''} alt={outfit.name} />

                  <span
                    className="deleteIcon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(outfit.id);
                    }}
                  >
                    <DeleteIcon />
                  </span>
                </div>

                <p>{outfit.name}</p>
              </div>
            ))}
          </div>

          <div className="paginationContainer">
            <Pagination
              count={Math.ceil(outfits.length / itemsPerPage)}
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