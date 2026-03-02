export interface ShowDetail {
    id: string;
    layoutWorkspace: string;
    currentShow: string;
    showName: string;
    showId?: string;
}

export interface ShowDetailResponse {
    success: boolean;
    data?: ShowDetail;
    message?: string;
}