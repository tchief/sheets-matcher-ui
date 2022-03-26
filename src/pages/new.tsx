import React from 'react';
import { useState } from 'react';
import { v4 as uuid } from 'uuid';
import { Button, Input, InputNumber } from '@supabase/ui';
import {
  ALL_SIDES_MAP,
  ALL_WHAT_MAP,
  City,
  id,
  mapSideToLabel,
  mapWhatToLabel,
  Side,
  What,
} from '../types';
import CitySelector from '../components/citySelector';
import UnionSelector from '../components/unionSelector';
import ReCAPTCHA from 'react-google-recaptcha';
import styles from '../styles/Home.module.css';
import { toast } from 'react-toastify';
import { User, withAuthRequired } from '@supabase/supabase-auth-helpers/nextjs';

const New = ({ user }: { user: User }) => {
  const [side, setSide] = useState<Side>('request');
  const [from, setFrom] = useState<City>();
  const [to, setTo] = useState<City>();
  const [what, setWhat] = useState<What>('human');
  const [seats, setSeats] = useState<number>(1);
  const [contact, setContact] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [when, setWhen] = useState<string>('');
  const [time, setTime] = useState<string | undefined>(undefined);
  const [description, setDescription] = useState('');
  const [recaptcha, setRecaptcha] = useState<string | null>('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const application = {
      id: uuid(),
      side,
      from: from?.city,
      to: to?.city,
      what,
      seats,
      contact,
      //phone,
      //email,
      when,
      time,
      description,
      //recaptcha,
      author: user.id,
    };

    console.log(application);

    try {
      setLoading(true);
      const response = await fetch('/api/application', {
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        credentials: 'same-origin',
        body: JSON.stringify({ ...application }),
      });
      setLoading(false);
      if (!response.ok) toast.error('Будь ласка, спробуйте ще раз.');
      else toast.success('Дякую!');
    } catch (error) {
      console.log({ error });
      toast.error('Будь ласка, спробуйте ще раз.');
      setLoading(false);
    }
  };
  return (
    <div className={`${styles.main} w-full`}>
      <h1 className={styles.title}>Додати запит</h1>
      <form onSubmit={handleSubmit} className="w-2/4">
        <div className="block mt-8">
          <label className="block mb-2">* Тип запиту?</label>
          <UnionSelector
            selected={side}
            setSelected={setSide}
            mapOptionToLabel={mapSideToLabel}
            mapOptionToValue={id}
            options={ALL_SIDES_MAP}
          />
        </div>

        <div className="block mt-8">
          <label className="block mb-2">* Де/звідки?</label>
          <CitySelector placeholder="Київ" selected={from} setSelected={setFrom} />
        </div>

        <div className="block mt-8">
          <label className="block mb-2">Куди?</label>
          <CitySelector placeholder="Київ" selected={to} setSelected={setTo} />
        </div>

        <div className="block mt-8">
          <label className="block mb-2">* Кого/що?</label>
          <UnionSelector
            selected={what}
            setSelected={setWhat}
            mapOptionToLabel={mapWhatToLabel}
            mapOptionToValue={id}
            options={ALL_WHAT_MAP}
          />
        </div>

        <div className="block mt-8">
          <label className="block mb-2">* Кількість/вага?</label>
          <InputNumber value={seats} onChange={(e) => setSeats(+e.target.value)} min={1} />
        </div>

        <div className="block mt-8">
          <label className="block mb-2">* Телеграм?</label>
          <Input value={contact} onChange={(e) => setContact(e.target.value)} />
        </div>

        <div className="block mt-8">
          <label className="block mb-2">* Коли?</label>
          <Input
            type="date"
            autoComplete="off"
            value={when}
            onChange={(e) => setWhen(e.target.value)}
          />
        </div>
        <div className="block mt-8">
          <label className="block mb-2">Є точний час?</label>
          <Input
            type="time"
            autoComplete="off"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>

        <div className="block mt-8">
          <label className="block mb-2">Деталі</label>
          <Input.TextArea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
          />
        </div>

        <Button disabled={!recaptcha || loading} block className="mt-8">
          Додати
        </Button>
        {error && <p className="text-lg">{error}</p>}
        <div className="flex mt-8 justify-center">
          <ReCAPTCHA
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE!}
            onChange={(e: string | null) => setRecaptcha(e)}
          />
        </div>
      </form>
    </div>
  );
};

export const getServerSideProps = withAuthRequired({ redirectTo: '/login' });

export default New;
