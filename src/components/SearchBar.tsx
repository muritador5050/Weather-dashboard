import { useState } from 'react';
import { Input, InputGroup, InputLeftElement } from '@chakra-ui/react';
import { Search } from 'lucide-react';

interface Props {
  onSearch: (city: string) => void;
}

export default function SearchBar({ onSearch }: Props) {
  const [q, setQ] = useState('');

  return (
    <InputGroup>
      <InputLeftElement>
        <Search />
      </InputLeftElement>
      <Input
        placeholder='Search city (e.g. Lagos, New York)'
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') onSearch(q);
        }}
      />
    </InputGroup>
  );
}
