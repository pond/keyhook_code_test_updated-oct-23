import React, { useState, useEffect } from 'react';

interface ListProps<T, H, S > {
  ListItem:        React.ComponentType<{ item: T }>;
  HeaderItem:      React.ComponentType<{ item: H }>;
  SpraypaintModel: new () => S;
}

export function List<T, H, S>({ ListItem, HeaderItem, SpraypaintModel }: ListProps<T, H, S>) {
  const [items,     setItems    ] = useState<S[]          >( [] );
  const [isLoading, setIsLoading] = useState<boolean      >( true );
  const [error,     setError    ] = useState<string | null>( null );

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await SpraypaintModel.all();
        setIsLoading(false);
        setItems(response.data);

      } catch (err) {
        setError(`Could not fetch information: ${err}`);
        setIsLoading(false);
      }
    };

    fetchItems();
  }, []);


  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 capitalize">{SpraypaintModel.jsonapiType}</h1>

      <table className="list-table">
        <thead>
          <HeaderItem />
        </thead>
        <tbody>
          {items.map(item => (
            <ListItem item={item} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
