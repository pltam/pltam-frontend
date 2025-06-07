import React from 'react';
import { Card, CardBody, CardHeader, Tabs, Tab, Avatar, Button, Chip } from '@heroui/react';
import { Icon } from '@iconify/react';
import { mockUser, mockClasses, mockMoims, mockPosts } from '../../data/mockData';

const ProfilePage: React.FC = () => {
  const [selected, setSelected] = React.useState<string>("posts");
  const user = mockUser;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long' };
    return new Intl.DateTimeFormat('ko-KR', options).format(date);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <Card className="mb-6">
        <CardBody className="p-6">
          <div className="flex flex-col md:flex-row items-center md:items-start">
            <Avatar 
              src={user.avatar} 
              alt={user.name} 
              className="mb-4 md:mb-0 md:mr-6"
              size="lg"
              isBordered
              color="primary"
            />
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl font-bold mb-1">{user.name}</h1>
              <p className="text-foreground-500 mb-3">{formatDate(user.joinDate)} 가입</p>
              <p className="text-foreground-600 mb-4 max-w-md">{user.bio}</p>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                <div className="flex items-center">
                  <Icon icon="lucide:map-pin" className="text-foreground-400 mr-1" />
                  <span className="text-foreground-600 text-sm">{user.location}</span>
                </div>
                <div className="flex items-center">
                  <Icon icon="lucide:circle" className={`mr-1 ${user.isOnline ? 'text-success' : 'text-foreground-400'}`} />
                  <span className="text-foreground-600 text-sm">{user.isOnline ? '온라인' : '오프라인'}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <Button color="primary" variant="flat">
                  프로필 수정
                </Button>
                <Button variant="bordered">
                  설정
                </Button>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader className="px-0 pt-0">
          <Tabs 
            aria-label="Profile options" 
            selectedKey={selected} 
            onSelectionChange={setSelected as any}
            className="w-full"
            variant="underlined"
            color="primary"
          >
            <Tab 
              key="posts" 
              title={
                <div className="flex items-center gap-2">
                  <Icon icon="lucide:file-text" />
                  <span>작성글</span>
                </div>
              }
            >
              <div className="p-6">
                {mockPosts.slice(0, 3).map((post) => {
                  return (
                    <Card key={post.id} className="mb-4 border border-divider">
                      <CardBody className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold">{post.title}</h3>
                          <Chip size="sm" variant="flat" color="default">
                            {post.boardTypeId === 2 ? "자유" : 
                             post.boardTypeId === 3 ? "질문" : 
                             post.boardTypeId === 4 ? "모임홍보" : 
                             post.boardTypeId === 5 ? "노하우" : "작품공유"}
                          </Chip>
                        </div>
                        <p className="text-foreground-600 text-sm mb-3 line-clamp-2">
                          {post.content}
                        </p>
                        <div className="flex justify-between items-center">
                          <div className="text-foreground-400 text-xs">
                            {new Date(post.createdAt).toLocaleDateString()}
                          </div>
                          <div className="flex items-center text-foreground-500 text-sm">
                            <div className="flex items-center mr-3">
                              <Icon icon="lucide:heart" className="mr-1 text-danger" />
                              <span>{post.likeCount}</span>
                            </div>
                            <div className="flex items-center">
                              <Icon icon="lucide:message-circle" className="mr-1" />
                              <span>{post.commentCount}</span>
                            </div>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  );
                })}
                {mockPosts.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Icon icon="lucide:file-x" className="text-foreground-300 text-5xl mb-4" />
                    <p className="text-foreground-600 mb-2">작성한 글이 없습니다</p>
                    <p className="text-foreground-400 text-sm">커뮤니티에 글을 작성해보세요</p>
                  </div>
                )}
              </div>
            </Tab>
            <Tab 
              key="moims" 
              title={
                <div className="flex items-center gap-2">
                  <Icon icon="lucide:users" />
                  <span>가입 모임</span>
                </div>
              }
            >
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mockMoims.slice(0, 4).map((moim) => {
                    return (
                      <Card key={moim.id} className="border border-divider">
                        <CardBody className="p-4">
                          <div className="flex">
                            <img 
                              src={moim.image} 
                              alt={moim.title} 
                              className="w-16 h-16 object-cover rounded-lg mr-3"
                            />
                            <div>
                              <h3 className="font-semibold mb-1">{moim.title}</h3>
                              <div className="flex items-center mb-1">
                                <Icon icon="lucide:map-pin" className="text-foreground-400 mr-1 text-sm" />
                                <span className="text-foreground-600 text-xs">{moim.location}</span>
                              </div>
                              <div className="flex items-center">
                                <Icon icon="lucide:users" className="text-foreground-400 mr-1 text-sm" />
                                <span className="text-foreground-600 text-xs">
                                  {moim.memberCount}/{moim.maxMembers}명
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    );
                  })}
                </div>
                {mockMoims.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Icon icon="lucide:users-x" className="text-foreground-300 text-5xl mb-4" />
                    <p className="text-foreground-600 mb-2">가입한 모임이 없습니다</p>
                    <p className="text-foreground-400 text-sm">관심있는 모임에 가입해보세요</p>
                  </div>
                )}
              </div>
            </Tab>
            <Tab 
              key="classes" 
              title={
                <div className="flex items-center gap-2">
                  <Icon icon="lucide:book-open" />
                  <span>참여 수업</span>
                </div>
              }
            >
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mockClasses.slice(0, 4).map((classItem) => {
                    return (
                      <Card key={classItem.id} className="border border-divider">
                        <CardBody className="p-4">
                          <div className="flex">
                            <img 
                              src={classItem.image} 
                              alt={classItem.title} 
                              className="w-16 h-16 object-cover rounded-lg mr-3"
                            />
                            <div>
                              <h3 className="font-semibold mb-1">{classItem.title}</h3>
                              <div className="flex items-center mb-1">
                                <img 
                                  src={classItem.instructor.avatar} 
                                  alt={classItem.instructor.name} 
                                  className="w-4 h-4 rounded-full mr-1"
                                />
                                <span className="text-foreground-600 text-xs">{classItem.instructor.name}</span>
                              </div>
                              <div className="flex items-center">
                                <Icon icon="lucide:map-pin" className="text-foreground-400 mr-1 text-sm" />
                                <span className="text-foreground-600 text-xs">{classItem.location}</span>
                              </div>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    );
                  })}
                </div>
                {mockClasses.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Icon icon="lucide:book-x" className="text-foreground-300 text-5xl mb-4" />
                    <p className="text-foreground-600 mb-2">참여한 수업이 없습니다</p>
                    <p className="text-foreground-400 text-sm">관심있는 수업에 참여해보세요</p>
                  </div>
                )}
              </div>
            </Tab>
          </Tabs>
        </CardHeader>
      </Card>
    </div>
  );
};

export default ProfilePage;