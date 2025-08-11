import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  TextField,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Chip,
  IconButton,
  InputAdornment,
  Fade,
  Popper,
  ClickAwayListener,
  useTheme,
  alpha,
  Divider,
  CircularProgress
} from '@mui/material';
import {
  Search as SearchIcon,
  Close as CloseIcon,
  History as HistoryIcon,
  TrendingUp as TrendingIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  Assignment as AssignmentIcon,
  Description as DocumentIcon,
  AttachMoney as MoneyIcon
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import { globalAISearch, SearchResult } from '../../services/globalAISearch';

interface GlobalAISearchProps {
  placeholder?: string;
  size?: 'small' | 'medium';
  fullWidth?: boolean;
  autoFocus?: boolean;
}

const GlobalAISearch: React.FC<GlobalAISearchProps> = ({
  placeholder = "Tìm kiếm thông minh với AI...",
  size = 'medium',
  fullWidth = false,
  autoFocus = false
}) => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize search context
  useEffect(() => {
    globalAISearch.setContext({
      currentPage: location.pathname,
      userRole: 'admin', // TODO: Get from auth context
      recentActivity: [],
      preferences: {}
    });
  }, [location.pathname]);

  // Load suggestions when opening search
  useEffect(() => {
    if (isOpen && query.length === 0) {
      loadSuggestions();
    }
  }, [isOpen]);

  // Search when query changes
  useEffect(() => {
    if (query.length > 0) {
      const debounceTimer = setTimeout(() => {
        performSearch(query);
      }, 300);
      
      return () => clearTimeout(debounceTimer);
    } else {
      setResults([]);
      if (isOpen) {
        loadSuggestions();
      }
    }
  }, [query]);

  const loadSuggestions = async () => {
    try {
      const suggestions = await globalAISearch.getSearchSuggestions('', location.pathname);
      setSuggestions(suggestions);
      
      const stats = globalAISearch.getSearchStats();
      setRecentSearches(stats.recentSearches);
    } catch (error) {
      console.error('Error loading suggestions:', error);
    }
  };

  const performSearch = async (searchQuery: string) => {
    setIsLoading(true);
    try {
      const searchResults = await globalAISearch.contextualSearch(searchQuery);
      setResults(searchResults);
    } catch (error) {
      console.error('Error performing search:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleClickAway = () => {
    setIsOpen(false);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    performSearch(suggestion);
  };

  const handleResultClick = (result: SearchResult) => {
    setIsOpen(false);
    setQuery('');
    navigate(result.url);
  };

  const handleClearSearch = () => {
    setQuery('');
    setResults([]);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const getTypeIcon = (type: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      customer: <PersonIcon />,
      deal: <MoneyIcon />,
      contact: <PersonIcon />,
      contract: <DocumentIcon />,
      invoice: <DocumentIcon />,
      requirement: <AssignmentIcon />,
      quotation: <BusinessIcon />
    };
    
    return iconMap[type] || <AssignmentIcon />;
  };

  const getTypeColor = (type: string) => {
    const colorMap: Record<string, string> = {
      customer: theme.palette.primary.main,
      deal: theme.palette.success.main,
      contact: theme.palette.info.main,
      contract: theme.palette.warning.main,
      invoice: theme.palette.error.main,
      requirement: theme.palette.secondary.main,
      quotation: theme.palette.grey[600]
    };
    
    return colorMap[type] || theme.palette.grey[500];
  };

  const highlightQuery = (text: string, query: string) => {
    if (!query) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <span key={index} style={{ backgroundColor: alpha(theme.palette.primary.main, 0.2) }}>
          {part}
        </span>
      ) : part
    );
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box ref={searchRef} sx={{ position: 'relative', width: fullWidth ? '100%' : 'auto' }}>
        <TextField
          ref={inputRef}
          fullWidth={fullWidth}
          size={size}
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          autoFocus={autoFocus}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: query && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={handleClearSearch}>
                  <CloseIcon />
                </IconButton>
              </InputAdornment>
            ),
            sx: {
              borderRadius: 3,
              backgroundColor: alpha(theme.palette.background.paper, 0.8),
              '&:hover': {
                backgroundColor: theme.palette.background.paper,
              },
              '&.Mui-focused': {
                backgroundColor: theme.palette.background.paper,
                boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`
              }
            }
          }}
        />

        <Popper
          open={isOpen}
          anchorEl={searchRef.current}
          placement="bottom-start"
          style={{ width: searchRef.current?.offsetWidth || 'auto', zIndex: 1300 }}
        >
          <Fade in={isOpen}>
            <Paper
              elevation={8}
              sx={{
                mt: 1,
                maxHeight: 400,
                overflow: 'auto',
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 2
              }}
            >
              {isLoading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                  <CircularProgress size={24} />
                </Box>
              )}

              {!isLoading && query.length === 0 && (
                <>
                  {/* Recent Searches */}
                  {recentSearches.length > 0 && (
                    <>
                      <Box sx={{ p: 2, pb: 1 }}>
                        <Typography variant="subtitle2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <HistoryIcon fontSize="small" />
                          Tìm kiếm gần đây
                        </Typography>
                      </Box>
                      <List dense>
                        {recentSearches.map((search, index) => (
                          <ListItemButton
                            key={index}
                            onClick={() => handleSuggestionClick(search)}
                          >
                            <ListItemText primary={search} />
                          </ListItemButton>
                        ))}
                      </List>
                      <Divider />
                    </>
                  )}

                  {/* Suggestions */}
                  <Box sx={{ p: 2, pb: 1 }}>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <TrendingIcon fontSize="small" />
                      Gợi ý cho trang này
                    </Typography>
                  </Box>
                  <List dense>
                    {suggestions.map((suggestion, index) => (
                      <ListItemButton
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        <ListItemText primary={suggestion} />
                      </ListItemButton>
                    ))}
                  </List>
                </>
              )}

              {!isLoading && query.length > 0 && results.length > 0 && (
                <>
                  <Box sx={{ p: 2, pb: 1 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Kết quả tìm kiếm ({results.length})
                    </Typography>
                  </Box>
                  <List dense>
                    {results.map((result) => (
                      <ListItemButton
                        key={result.id}
                        onClick={() => handleResultClick(result)}
                        sx={{
                          '&:hover': {
                            backgroundColor: alpha(theme.palette.primary.main, 0.05)
                          }
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar
                            sx={{
                              backgroundColor: alpha(getTypeColor(result.type), 0.1),
                              color: getTypeColor(result.type),
                              width: 32,
                              height: 32
                            }}
                          >
                            {getTypeIcon(result.type)}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="subtitle2">
                                {highlightQuery(result.title, query)}
                              </Typography>
                              <Chip
                                label={result.type}
                                size="small"
                                sx={{
                                  height: 18,
                                  fontSize: '0.7rem',
                                  backgroundColor: alpha(getTypeColor(result.type), 0.1),
                                  color: getTypeColor(result.type)
                                }}
                              />
                            </Box>
                          }
                          secondary={
                            <Typography variant="caption" color="text.secondary">
                              {highlightQuery(result.description, query)}
                            </Typography>
                          }
                        />
                        <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                          {Math.round(result.relevanceScore * 100)}%
                        </Typography>
                      </ListItemButton>
                    ))}
                  </List>
                </>
              )}

              {!isLoading && query.length > 0 && results.length === 0 && (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Không tìm thấy kết quả cho "{query}"
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    Thử tìm kiếm với từ khóa khác hoặc sử dụng tìm kiếm semantic
                  </Typography>
                </Box>
              )}
            </Paper>
          </Fade>
        </Popper>
      </Box>
    </ClickAwayListener>
  );
};

export default GlobalAISearch;
