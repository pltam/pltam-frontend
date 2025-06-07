import React from 'react';
import { Button } from '@heroui/react';
import { useAppContext } from '../../context/AppContext';

const BoardTypeFilter: React.FC = () => {
  const { boardTypes, selectedBoardType, setSelectedBoardType } = useAppContext();

  return (
    <div className="overflow-x-auto category-scroll pb-2">
      <div className="flex space-x-2 min-w-max">
        {boardTypes.map((boardType) => (
          <Button
            key={boardType.id}
            size="sm"
            variant={selectedBoardType?.id === boardType.id ? "solid" : "light"}
            color={selectedBoardType?.id === boardType.id ? "primary" : "default"}
            onClick={() => setSelectedBoardType(boardType)}
          >
            {boardType.name}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default BoardTypeFilter;