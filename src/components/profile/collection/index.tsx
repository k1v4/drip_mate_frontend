import { Button, Slider, Typography } from '@mui/material';
import React, { JSX, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Selection: React.FC = (): JSX.Element => {
  const navigate = useNavigate();

  const [rating, setRating] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmitRating = async () => {
    if (loading) return;
    try {
      setLoading(true);

      const response = await fetch('/api/v1/recommendation', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ formality: rating }),
      });

      if (!response.ok) throw new Error();

      const { catalog, log_id } = await response.json();

      navigate('/outfit', { state: { items: catalog, logId: log_id } });
    } catch (e) {
      console.error('Ошибка формирования образа:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleRatingChange = (_: Event, value: number | number[]) => {
    setRating(value as number);
  };

  return (
    <div className='collectionMain'>
      <div className="ratingContainer">
        <div className="ratingContent">

          <Typography sx={{ color: '#F9F8F3', textAlign: 'center', mb: 2, fontFamily: 'Inter', fontSize: '25px' }}>
            Выберите уровень формальности образа
          </Typography>

          <Typography sx={{ color: '#aaa', fontSize: '12px', textAlign: 'center', mb: 2 }}>
            1 — неформально · 5 — максимально формально
          </Typography>

          <Slider
            value={rating}
            min={1}
            max={5}
            step={1}
            marks
            valueLabelDisplay="auto"
            onChange={handleRatingChange}
          />

          <Button
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{
              mt: 2,
              backgroundColor: '#F9F8F3',
              color: '#0E0F15',
              borderRadius: '12px',
              opacity: loading ? 0.6 : 1,
            }}
            onClick={handleSubmitRating}
          >
            {loading ? 'Подбираем...' : 'Подобрать образ'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Selection;