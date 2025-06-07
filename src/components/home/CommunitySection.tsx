import React from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {Card, CardBody, Button, Chip, Avatar} from '@heroui/react';
import {Icon} from '@iconify/react';
import {motion} from 'framer-motion';
import {useProfileClick} from '../profile/ProfileClickProvider';
import {mockPosts} from '../../data/mockData';

const CommunitySection: React.FC = () => {
    const navigate = useNavigate();
    const {onProfileClick} = useProfileClick();

    const handleCardClick = (postId: number) => {
        navigate(`/community-post-detail/${postId}`);
    };

    const handleAuthorClick = (e: React.MouseEvent, authorId: number) => {
        e.stopPropagation(); // 카드 클릭 이벤트 방지
        onProfileClick(authorId, e);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffMins < 60) {
            return `${diffMins}분 전`;
        } else if (diffHours < 24) {
            return `${diffHours}시간 전`;
        } else {
            return `${diffDays}일 전`;
        }
    };

    const getBoardTypeName = (boardTypeId: number) => {
        switch (boardTypeId) {
            case 2:
                return "자유";
            case 3:
                return "질문";
            case 4:
                return "모임홍보";
            case 5:
                return "노하우";
            case 6:
                return "작품공유";
            default:
                return "전체";
        }
    };

    return (
        <section className="py-10 bg-content1">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-foreground">커뮤니티</h2>
                    <Button
                        as={Link}
                        to="/community"
                        variant="light"
                        color="primary"
                        endContent={<Icon icon="lucide:arrow-right"/>}
                    >
                        더보기
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {mockPosts.slice(0, 3).map((post) => {
                        return (
                            <motion.div
                                key={post.id}
                                whileHover={{y: -3}}
                                transition={{duration: 0.2}}
                                className="w-full" // 가로 길이 균등하게
                            >
                                <Card
                                    className="h-full cursor-pointer hover:shadow-lg w-full" // w-full 추가
                                    isPressable
                                    onPress={() => handleCardClick(post.id)}
                                >
                                    <CardBody className="p-6">
                                        <div className="flex items-center justify-between mb-3">
                                            <Chip
                                                size="sm"
                                                variant="flat"
                                                color="primary"
                                            >
                                                {getBoardTypeName(post.boardTypeId)}
                                            </Chip>
                                            <span
                                                className="text-foreground-400 text-xs">{formatDate(post.createdAt)}</span>
                                        </div>

                                        <h3 className="font-bold text-lg text-foreground mb-2 line-clamp-2">
                                            {post.title}
                                        </h3>

                                        <p className="text-foreground-600 text-sm mb-4 line-clamp-3">
                                            {post.content}
                                        </p>

                                        <div className="flex items-center justify-between">
                                            {/* 작성자 프로필 - 클릭 가능 */}
                                            <div 
                                                className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 rounded-lg p-2 -mx-2 transition-colors"
                                                onClick={(e) => handleAuthorClick(e, post.author.id)}
                                            >
                                                <Avatar src={post.author.avatar} size="sm"/>
                                                <span className="text-foreground-700 text-sm font-medium">
                                                    {post.author.name}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-foreground-500">
                                                <div className="flex items-center gap-1">
                                                    <Icon icon="lucide:heart" className="text-sm"/>
                                                    <span>{post.likeCount}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Icon icon="lucide:message-circle" className="text-sm"/>
                                                    <span>{post.commentCount}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default CommunitySection;