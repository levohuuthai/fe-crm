// Global AI Search Service
// Thay thế tất cả bộ lọc search truyền thống bằng AI search thông minh

import { aiOrchestrator, AIRequest } from '../aiOrchestration';

export interface SearchResult {
  id: string;
  type: 'customer' | 'deal' | 'contact' | 'contract' | 'invoice' | 'requirement' | 'quotation';
  title: string;
  description: string;
  relevanceScore: number;
  metadata: Record<string, any>;
  url: string;
  timestamp: Date;
}

export interface SearchContext {
  currentPage: string;
  userRole: string;
  recentActivity: string[];
  preferences: Record<string, any>;
  // Additional context properties
  contextual?: boolean;
  quickSearch?: boolean;
  maxResults?: number;
}

export interface SearchFilters {
  types?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  status?: string[];
  priority?: string[];
  assignedTo?: string[];
}

export class GlobalAISearchService {
  private searchHistory: string[] = [];
  private searchCache: Map<string, SearchResult[]> = new Map();
  private contextData: SearchContext | null = null;

  constructor() {
    this.loadSearchHistory();
  }

  // Thiết lập context cho search
  public setContext(context: SearchContext) {
    this.contextData = context;
  }

  // Thực hiện AI search thông minh
  public async search(
    query: string, 
    filters?: SearchFilters,
    context?: Partial<SearchContext>
  ): Promise<SearchResult[]> {
    // Kiểm tra cache trước
    const cacheKey = this.generateCacheKey(query, filters);
    if (this.searchCache.has(cacheKey)) {
      return this.searchCache.get(cacheKey)!;
    }

    try {
      // Chuẩn bị request cho AI Orchestrator
      const searchRequest: AIRequest = {
        id: `search_${Date.now()}`,
        type: 'search',
        data: {
          query,
          filters,
          context: { ...this.contextData, ...context },
          searchHistory: this.searchHistory.slice(-5) // 5 tìm kiếm gần nhất
        },
        timestamp: new Date()
      };

      // Gửi request tới AI Orchestrator
      const response = await aiOrchestrator.processRequest(searchRequest);
      
      // Xử lý kết quả
      const results = this.processSearchResults(response.result, query);
      
      // Lưu vào cache
      this.searchCache.set(cacheKey, results);
      
      // Cập nhật lịch sử tìm kiếm
      this.addToSearchHistory(query);
      
      return results;
    } catch (error) {
      console.error('Error in AI search:', error);
      return this.getFallbackResults(query, filters);
    }
  }

  // Tìm kiếm nhanh với gợi ý
  public async quickSearch(query: string): Promise<SearchResult[]> {
    if (query.length < 2) return [];
    
    return this.search(query, undefined, { 
      quickSearch: true,
      maxResults: 5 
    });
  }

  // Lấy gợi ý tìm kiếm thông minh
  public async getSearchSuggestions(
    partialQuery: string,
    currentPage?: string
  ): Promise<string[]> {
    if (partialQuery.length < 2) {
      return this.getPopularSearches(currentPage);
    }

    try {
      const suggestionRequest: AIRequest = {
        id: `suggestions_${Date.now()}`,
        type: 'search',
        data: {
          type: 'suggestions',
          partialQuery,
          currentPage,
          searchHistory: this.searchHistory
        },
        timestamp: new Date()
      };

      const response = await aiOrchestrator.processRequest(suggestionRequest);
      return response.result.suggestions || [];
    } catch (error) {
      console.error('Error getting search suggestions:', error);
      return this.getPopularSearches(currentPage);
    }
  }

  // Tìm kiếm theo ngữ cảnh trang hiện tại
  public async contextualSearch(query: string): Promise<SearchResult[]> {
    const context = this.contextData?.currentPage || '';
    
    // Điều chỉnh search dựa trên trang hiện tại
    const contextualFilters: SearchFilters = {};
    
    switch (context) {
      case '/customers':
        contextualFilters.types = ['customer', 'contact'];
        break;
      case '/deals':
        contextualFilters.types = ['deal', 'quotation'];
        break;
      case '/contracts':
        contextualFilters.types = ['contract', 'invoice'];
        break;
      default:
        // Không giới hạn type cho trang khác
        break;
    }

    return this.search(query, contextualFilters, { contextual: true });
  }

  // Tìm kiếm semantic (tìm theo ý nghĩa)
  public async semanticSearch(query: string): Promise<SearchResult[]> {
    const semanticRequest: AIRequest = {
      id: `semantic_${Date.now()}`,
      type: 'search',
      data: {
        type: 'semantic',
        query,
        context: this.contextData
      },
      timestamp: new Date()
    };

    try {
      const response = await aiOrchestrator.processRequest(semanticRequest);
      return this.processSearchResults(response.result, query);
    } catch (error) {
      console.error('Error in semantic search:', error);
      return [];
    }
  }

  // Xử lý kết quả search từ AI
  private processSearchResults(aiResult: any, originalQuery: string): SearchResult[] {
    const results = aiResult.results || [];
    
    return results.map((result: any, index: number) => ({
      id: result.id || `result_${index}`,
      type: result.type || 'customer',
      title: result.title || result.name || 'Untitled',
      description: result.description || result.summary || '',
      relevanceScore: result.relevance || (1 - index * 0.1),
      metadata: result.metadata || {},
      url: this.generateResultUrl(result.type, result.id),
      timestamp: new Date()
    }));
  }

  // Tạo URL cho kết quả
  private generateResultUrl(type: string, id: string): string {
    const baseUrls: Record<string, string> = {
      customer: '/customers',
      deal: '/deals',
      contact: '/contacts',
      contract: '/contracts',
      invoice: '/invoices',
      requirement: '/requirements',
      quotation: '/quotations'
    };

    return `${baseUrls[type] || '/'}/${id}`;
  }

  // Tạo cache key
  private generateCacheKey(query: string, filters?: SearchFilters): string {
    return `${query}_${JSON.stringify(filters || {})}`;
  }

  // Lấy kết quả fallback khi AI không hoạt động
  private getFallbackResults(query: string, filters?: SearchFilters): SearchResult[] {
    // Mô phỏng kết quả tìm kiếm cơ bản
    const mockResults: SearchResult[] = [
      {
        id: '1',
        type: 'customer',
        title: `Khách hàng liên quan đến "${query}"`,
        description: 'Kết quả tìm kiếm cơ bản',
        relevanceScore: 0.8,
        metadata: {},
        url: '/customers/1',
        timestamp: new Date()
      }
    ];

    return mockResults;
  }

  // Lấy các tìm kiếm phổ biến
  private getPopularSearches(currentPage?: string): string[] {
    const popularSearches: Record<string, string[]> = {
      '/dashboard': [
        'Doanh thu tháng này',
        'Deal đang pending',
        'Khách hàng mới',
        'Top performer'
      ],
      '/customers': [
        'Khách hàng VIP',
        'Khách hàng mới',
        'Khách hàng chưa liên hệ',
        'Khách hàng có deal lớn'
      ],
      '/deals': [
        'Deal closing',
        'Deal high value',
        'Deal pending',
        'Deal won this month'
      ],
      default: [
        'Tìm kiếm nhanh',
        'Báo cáo',
        'Thống kê',
        'Phân tích'
      ]
    };

    return popularSearches[currentPage || 'default'] || popularSearches.default;
  }

  // Quản lý lịch sử tìm kiếm
  private addToSearchHistory(query: string) {
    if (!this.searchHistory.includes(query)) {
      this.searchHistory.unshift(query);
      this.searchHistory = this.searchHistory.slice(0, 20); // Giữ 20 tìm kiếm gần nhất
      this.saveSearchHistory();
    }
  }

  private loadSearchHistory() {
    try {
      const saved = localStorage.getItem('ai_search_history');
      if (saved) {
        this.searchHistory = JSON.parse(saved);
      }
    } catch (error) {
      console.error('Error loading search history:', error);
    }
  }

  private saveSearchHistory() {
    try {
      localStorage.setItem('ai_search_history', JSON.stringify(this.searchHistory));
    } catch (error) {
      console.error('Error saving search history:', error);
    }
  }

  // Xóa cache
  public clearCache() {
    this.searchCache.clear();
  }

  // Lấy thống kê search
  public getSearchStats() {
    return {
      historyCount: this.searchHistory.length,
      cacheSize: this.searchCache.size,
      recentSearches: this.searchHistory.slice(0, 5)
    };
  }

  // Xuất dữ liệu search để phân tích
  public exportSearchData() {
    return {
      history: this.searchHistory,
      context: this.contextData,
      timestamp: new Date()
    };
  }
}

// Export singleton instance
export const globalAISearch = new GlobalAISearchService();
