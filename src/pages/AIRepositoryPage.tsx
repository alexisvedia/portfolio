import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useApi } from '../services/api';

const Container = styled.div`
  padding: 2rem;
`;

const SearchBar = styled.input`
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ccc;
  width: 100%;
  max-width: 300px;
`;

const Grid = styled.div`
  margin-top: 1rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.cardBackground};
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
`;

const Favicon = styled.img`
  width: 32px;
  height: 32px;
`;

interface AIPage {
  id: number;
  title: string;
  description?: string;
  url: string;
  favicon_url?: string;
}

export default function AIRepositoryPage() {
  const api = useApi();
  const [pages, setPages] = useState<AIPage[]>([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    api
      .getAiPages()
      .then(setPages)
      .catch(() => {});
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await api.searchAiPages(query);
    setPages(res);
  };

  return (
    <Container>
      <form onSubmit={handleSearch}>
        <SearchBar value={query} onChange={e => setQuery(e.target.value)} placeholder="Search" />
      </form>
      <Grid>
        {pages.map(p => (
          <Card key={p.id}>
            {p.favicon_url && <Favicon src={p.favicon_url} alt="" />}
            <h4>{p.title}</h4>
            <p>{p.description}</p>
            <a href={p.url} target="_blank" rel="noreferrer">
              Visit
            </a>
          </Card>
        ))}
      </Grid>
    </Container>
  );
}
