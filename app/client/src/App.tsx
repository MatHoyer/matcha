import { useState } from 'react';
import { Button } from './components/ui/button';

const App = () => {
  const [count, setCount] = useState(0);

  return (
    <div className="size-full flex justify-center items-center">
      <Button className="cursor-pointer" onClick={() => setCount((count) => count + 1)}>
        Count is {count}
      </Button>
    </div>
  );
};

export default App;
