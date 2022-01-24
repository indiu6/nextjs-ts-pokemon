import { getOptionsForVote } from '@/utils/getRandomPokemon';
import { trpc } from '@/utils/trpc';
import type { NextPage } from 'next';
import React, { useState } from 'react';
import { inferQueryResponse } from './api/trpc/[trpc]';

const Home: NextPage = () => {
  // const { data, isLoading } = trpc.useQuery(['hello', { text: 'Sean' }]);
  // if (isLoading) return <div>Loading...</div>;
  // if (data) return <div>{data.greeting}</div>;

  const [ids, updateIds] = useState(() => getOptionsForVote());
  const [first, second] = ids;

  const firstPokemon = trpc.useQuery(['get-pokemon-by-id', { id: first }]);
  // console.log(firstPokemon.data);
  const secondPokemon = trpc.useQuery(['get-pokemon-by-id', { id: second }]);

  if (firstPokemon.isLoading || secondPokemon.isLoading) return null;

  const voteForRoundest = (selected: number) => {
    //todo fire mutation to persist changes
    updateIds(getOptionsForVote());
  };

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <div className="text-2xl text-center">Which Pokemon is Rounder?</div>
      <div className="p-2" />
      <div className="border rounded p-8 flex justify-between items-center max-w-2xl">
        {!firstPokemon.isLoading &&
          firstPokemon.data &&
          !secondPokemon.isLoading &&
          secondPokemon.data && (
            <>
              <PokemonListing
                pokemon={firstPokemon.data}
                vote={() => voteForRoundest(first)}
              />
              <div className="p-8">Vs</div>
              <PokemonListing
                pokemon={secondPokemon.data}
                vote={() => voteForRoundest(second)}
              />
            </>
          )}

        <div className="p-2"></div>
      </div>
    </div>
  );
};

export default Home;

type PokemonFromServer = inferQueryResponse<'get-pokemon-by-id'>;

const PokemonListing: React.FC<{
  pokemon: PokemonFromServer;
  vote: () => void;
}> = (props) => {
  return (
    <div className="flex flex-col items-center">
      <img src={props.pokemon.sprites.front_default} className="w-64 h-64" />
      <div className="text-xl text-center capitalize mt-[-2rem]">
        {props.pokemon.name}
      </div>
      <button
        className="border border-gray-300 rounded bg-white p-0.5 mt-2 text-black text-m"
        onClick={() => props.vote()}
      >
        Rounder
      </button>
    </div>
  );
};
