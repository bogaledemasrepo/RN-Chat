export interface User{
    id:string;
    email:string;
    name:string;
    avator:string;
    isOnline?:boolean;
    token?:string;
}
export interface UserResponse{
    token:string,
    user:User
}

export interface FriendDetail{
    id: string;
    name: string;
    message: string;
    time: string;
    unread: number;
    online: boolean;
    avator: string;
}
export interface Chat{
        friendDetail: FriendDetail;
        id: string;
        isUnread: boolean;
        latestMessage: string;
        timestamp: string;
        toMe: boolean;
    }
export interface FriendsResponse{
    data: Chat[];
    meta: {
        currentPage: number;
        itemsPerPage: number;
        totalItems: number;
        totalPages: number;
    };
}