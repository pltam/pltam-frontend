import React, {useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {Card, CardBody, Button, Chip, Avatar, Divider, Textarea} from '@heroui/react';
import {Icon} from '@iconify/react';
import {mockPosts} from '../../data/mockData';
import { useProfileClick } from '../../components/profile/ProfileClickProvider';

const CommunityPostDetailPage: React.FC = () => {
    const {id} = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { onProfileClick } = useProfileClick();
    const [isLiked, setIsLiked] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [likes, setLikes] = useState(0);

    // 실제 데이터 가져오기
    const postData = mockPosts.find(post => post.id === Number(id));

    // likes 초기값 설정
    React.useEffect(() => {
        if (postData) {
            setLikes(postData.likeCount);
        }
    }, [postData]);

    // 포스트가 없으면 404 처리
    if (!postData) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">게시글을 찾을 수 없습니다</h1>
                    <Button onPress={() => navigate('/community')}>
                        커뮤니티로 돌아가기
                    </Button>
                </div>
            </div>
        );
    }

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

    const commentsData = [
        {
            id: 1,
            authorId: 301,
            author: '댓글작성자1',
            authorImage: 'https://img.heroui.chat/image/avatar?w=100&h=100&u=301',
            content: '정말 유용한 글이네요! 도움이 많이 됐습니다.',
            createdAt: '1시간 전',
            likes: 3
        },
        {
            id: 2,
            authorId: 302,
            author: '댓글작성자2',
            authorImage: 'https://img.heroui.chat/image/avatar?w=100&h=100&u=302',
            content: '저도 같은 생각이에요. 좋은 정보 감사합니다!',
            createdAt: '45분 전',
            likes: 5
        }
    ];

    const handleAuthorClick = (e: React.MouseEvent, authorId: number) => {
        e.stopPropagation();
        onProfileClick(authorId, e);
    };

    const handleCommentAuthorClick = (e: React.MouseEvent, authorId: number) => {
        e.stopPropagation();
        onProfileClick(authorId, e);
    };

    const handleLike = () => {
        setIsLiked(!isLiked);
        setLikes(prev => isLiked ? prev - 1 : prev + 1);
    };

    const handleCommentSubmit = () => {
        if (newComment.trim()) {
            alert('댓글이 등록되었습니다!');
            setNewComment('');
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
                <Button
                    variant="light"
                    startContent={<Icon icon="lucide:arrow-left"/>}
                    onPress={handleBack}
                    className="mb-6"
                >
                    뒤로가기
                </Button>

                <div className="max-w-4xl mx-auto">
                    <Card className="mb-6">
                        <CardBody className="p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Chip size="sm" variant="flat" color="primary">
                                    {getBoardTypeName(postData.boardTypeId)}
                                </Chip>
                                <span className="text-foreground-400 text-sm">
                  {formatDate(postData.createdAt)}
                </span>
                            </div>

                            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                                {postData.title}
                            </h1>

                            <div 
                                className="flex items-center gap-4 mb-6 cursor-pointer hover:bg-gray-50 rounded-lg p-2 -mx-2 transition-colors"
                                onClick={(e) => handleAuthorClick(e, postData.author.id)}
                            >
                                <Avatar src={postData.author.avatar} size="md"/>
                                <div>
                                    <p className="font-medium text-foreground">{postData.author.name}</p>
                                    <div className="flex items-center gap-4 text-sm text-foreground-500">
                                        <div className="flex items-center gap-1">
                                            <Icon icon="lucide:eye" className="text-sm"/>
                                            <span>{postData.viewCount}회</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Icon icon="lucide:heart" className="text-sm"/>
                                            <span>{likes}개</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Icon icon="lucide:message-circle" className="text-sm"/>
                                            <span>{postData.commentCount}개</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Divider className="my-6"/>

                            <div className="text-foreground-600 whitespace-pre-line mb-6">
                                {postData.content}
                            </div>

                            {postData.images && postData.images.length > 0 && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                    {postData.images.map((image, index) => (
                                        <img
                                            key={index}
                                            src={image}
                                            alt={`게시글 첨부 ${index + 1}`}
                                            className="w-full h-64 object-cover rounded-lg"
                                        />
                                    ))}
                                </div>
                            )}

                            <Divider className="my-6"/>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <Button
                                        variant={isLiked ? "solid" : "bordered"}
                                        color={isLiked ? "danger" : "default"}
                                        startContent={<Icon icon="lucide:heart"
                                                            className={isLiked ? "fill-current" : ""}/>}
                                        onPress={handleLike}
                                    >
                                        좋아요 {likes}
                                    </Button>
                                    <Button
                                        variant="bordered"
                                        startContent={<Icon icon="lucide:message-circle"/>}
                                    >
                                        댓글 {postData.commentCount}
                                    </Button>
                                </div>
                                <Button
                                    variant="light"
                                    startContent={<Icon icon="lucide:share-2"/>}
                                >
                                    공유
                                </Button>
                            </div>
                        </CardBody>
                    </Card>

                    <Card>
                        <CardBody className="p-6">
                            <h2 className="text-xl font-bold mb-4">댓글 {commentsData.length}개</h2>

                            <div className="mb-6">
                                <Textarea
                                    placeholder="댓글을 입력하세요..."
                                    value={newComment}
                                    onValueChange={setNewComment}
                                    className="mb-3"
                                    minRows={3}
                                />
                                <div className="flex justify-end">
                                    <Button
                                        color="primary"
                                        onPress={handleCommentSubmit}
                                        isDisabled={!newComment.trim()}
                                    >
                                        댓글 등록
                                    </Button>
                                </div>
                            </div>

                            <Divider className="my-4"/>

                            <div className="space-y-6">
                                {commentsData.map((comment) => (
                                    <div key={comment.id} className="flex gap-4">
                                        <Avatar 
                                            src={comment.authorImage} 
                                            size="sm"
                                            className="cursor-pointer hover:scale-110 transition-transform"
                                            onClick={(e) => handleCommentAuthorClick(e, comment.authorId)}
                                        />
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span 
                                                    className="font-medium text-foreground cursor-pointer hover:text-primary transition-colors"
                                                    onClick={(e) => handleCommentAuthorClick(e, comment.authorId)}
                                                >
                                                    {comment.author}
                                                </span>
                                                <span className="text-foreground-400 text-sm">{comment.createdAt}</span>
                                            </div>
                                            <p className="text-foreground-600 mb-2">{comment.content}</p>
                                            <div className="flex items-center gap-4">
                                                <Button
                                                    size="sm"
                                                    variant="light"
                                                    startContent={<Icon icon="lucide:heart" className="text-sm"/>}
                                                >
                                                    {comment.likes}
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="light"
                                                >
                                                    답글
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default CommunityPostDetailPage;
