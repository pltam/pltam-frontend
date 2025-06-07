import React from 'react';
import { Card, CardBody, CardHeader, Avatar, Input, Button, Tabs, Tab } from '@heroui/react';
import { Icon } from '@iconify/react';
import { mockChatRooms } from '../../data/mockData';

const ChatPage: React.FC = () => {
  const [selected, setSelected] = React.useState<string>("all");
  const [activeChatId, setActiveChatId] = React.useState<string | null>(null);
  const [message, setMessage] = React.useState<string>("");

  const filteredChatRooms = React.useMemo(() => {
    if (selected === "all") return mockChatRooms;
    if (selected === "groups") return mockChatRooms.filter(room => room.isGroup);
    if (selected === "direct") return mockChatRooms.filter(room => !room.isGroup);
    return mockChatRooms;
  }, [selected]);

  const activeChat = React.useMemo(() => {
    return mockChatRooms.find(room => room.id === activeChatId);
  }, [activeChatId]);

  const handleSendMessage = () => {
    if (message.trim()) {
      // 실제 구현에서는 메시지 전송 처리
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">채팅</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 h-[600px] flex flex-col">
          <CardHeader className="px-4 py-3 border-b border-divider">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">메시지</h2>
              <Button isIconOnly variant="light" size="sm">
                <Icon icon="lucide:edit" />
              </Button>
            </div>
          </CardHeader>
          <CardBody className="p-0 flex-1 flex flex-col">
            <div className="p-2 border-b border-divider">
              <Input
                placeholder="대화 검색"
                startContent={<Icon icon="lucide:search" className="text-foreground-400" />}
                size="sm"
                radius="lg"
              />
            </div>

            <Tabs 
              aria-label="Chat options" 
              selectedKey={selected} 
              onSelectionChange={(key) => setSelected(key as string)}
              className="w-full"
              variant="underlined"
              color="primary"
              classNames={{
                tabList: "px-4",
                panel: "flex-1 overflow-y-auto"
              }}
            >
              <Tab key="all" title="전체">
                <div className="divide-y divide-divider">
                  {filteredChatRooms.map((room) => (
                    <div 
                      key={room.id} 
                      className={`flex items-center p-3 cursor-pointer hover:bg-content2 ${activeChatId === room.id ? 'bg-content2' : ''}`}
                      onClick={() => setActiveChatId(room.id)}
                    >
                      <div className="relative mr-3">
                        <Avatar src={room.avatar} size="sm" />
                        {!room.isGroup && (
                          <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-content1 ${room.isOnline ? 'bg-success' : 'bg-foreground-300'}`}></span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between">
                          <p className="font-medium text-sm truncate">{room.name}</p>
                          <span className="text-xs text-foreground-500">{room.timestamp}</span>
                        </div>
                        <div className="flex justify-between">
                          <p className="text-xs text-foreground-500 truncate">{room.lastMessage}</p>
                          {room.unreadCount > 0 && (
                            <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-primary rounded-full">
                              {room.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Tab>
              <Tab key="groups" title="모임">
                <div className="divide-y divide-divider">
                  {filteredChatRooms.map((room) => (
                    <div 
                      key={room.id} 
                      className={`flex items-center p-3 cursor-pointer hover:bg-content2 ${activeChatId === room.id ? 'bg-content2' : ''}`}
                      onClick={() => setActiveChatId(room.id)}
                    >
                      <div className="relative mr-3">
                        <Avatar src={room.avatar} size="sm" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between">
                          <p className="font-medium text-sm truncate">{room.name}</p>
                          <span className="text-xs text-foreground-500">{room.timestamp}</span>
                        </div>
                        <div className="flex justify-between">
                          <p className="text-xs text-foreground-500 truncate">{room.lastMessage}</p>
                          {room.unreadCount > 0 && (
                            <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-primary rounded-full">
                              {room.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Tab>
              <Tab key="direct" title="개인">
                <div className="divide-y divide-divider">
                  {filteredChatRooms.map((room) => (
                    <div 
                      key={room.id} 
                      className={`flex items-center p-3 cursor-pointer hover:bg-content2 ${activeChatId === room.id ? 'bg-content2' : ''}`}
                      onClick={() => setActiveChatId(room.id)}
                    >
                      <div className="relative mr-3">
                        <Avatar src={room.avatar} size="sm" />
                        <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-content1 ${room.isOnline ? 'bg-success' : 'bg-foreground-300'}`}></span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between">
                          <p className="font-medium text-sm truncate">{room.name}</p>
                          <span className="text-xs text-foreground-500">{room.timestamp}</span>
                        </div>
                        <div className="flex justify-between">
                          <p className="text-xs text-foreground-500 truncate">{room.lastMessage}</p>
                          {room.unreadCount > 0 && (
                            <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-primary rounded-full">
                              {room.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Tab>
            </Tabs>
          </CardBody>
        </Card>

        <Card className="lg:col-span-2 h-[600px] flex flex-col">
          {activeChat ? (
            <>
              <CardHeader className="px-4 py-3 border-b border-divider">
                <div className="flex items-center">
                  <div className="relative mr-3">
                    <Avatar src={activeChat.avatar} size="sm" />
                    {!activeChat.isGroup && (
                      <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-content1 ${activeChat.isOnline ? 'bg-success' : 'bg-foreground-300'}`}></span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h2 className="font-semibold">{activeChat.name}</h2>
                    <p className="text-xs text-foreground-500">
                      {activeChat.isGroup 
                        ? `${activeChat.memberCount}명 참여중` 
                        : activeChat.isOnline ? '온라인' : '오프라인'}
                    </p>
                  </div>
                  <Button isIconOnly variant="light" size="sm">
                    <Icon icon="lucide:more-vertical" />
                  </Button>
                </div>
              </CardHeader>
              <CardBody className="p-4 flex-1 overflow-y-auto">
                <div className="flex flex-col space-y-4">
                  <div className="text-center text-xs text-foreground-400 my-2">
                    오늘
                  </div>

                  <div className="flex items-start">
                    <Avatar src={activeChat.avatar} className="mr-2" size="sm" />
                    <div className="bg-content2 rounded-lg p-3 max-w-[80%]">
                      <p className="text-sm">{activeChat.lastMessage}</p>
                      <p className="text-xs text-foreground-400 text-right mt-1">{activeChat.timestamp}</p>
                    </div>
                  </div>

                  <div className="flex items-start justify-end">
                    <div className="bg-primary rounded-lg p-3 max-w-[80%]">
                      <p className="text-sm text-white">안녕하세요! 반갑습니다.</p>
                      <p className="text-xs text-primary-100 text-right mt-1">10:35</p>
                    </div>
                  </div>
                </div>
              </CardBody>
              <div className="p-3 border-t border-divider">
                <div className="flex gap-2">
                  <Input
                    placeholder="메시지를 입력하세요..."
                    value={message}
                    onValueChange={setMessage}
                    onKeyDown={handleKeyDown}
                    variant="bordered"
                    radius="lg"
                    className="flex-1"
                    endContent={
                      <div className="flex gap-1">
                        <Button isIconOnly variant="light" size="sm">
                          <Icon icon="lucide:image" className="text-foreground-400" />
                        </Button>
                        <Button isIconOnly variant="light" size="sm">
                          <Icon icon="lucide:smile" className="text-foreground-400" />
                        </Button>
                      </div>
                    }
                  />
                  <Button 
                    isIconOnly 
                    color="primary" 
                    onPress={handleSendMessage}
                    radius="full"
                  >
                    <Icon icon="lucide:send" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Icon icon="lucide:message-circle" className="text-primary text-2xl" />
              </div>
              <h3 className="text-lg font-semibold mb-2">메시지를 선택하세요</h3>
              <p className="text-center text-foreground-500 text-sm max-w-md">
                왼쪽에서 대화를 선택하거나 새로운 메시지를 시작하세요.
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ChatPage;