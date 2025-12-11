import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useMoodTheme } from '@/hooks/useMoodTheme';
import { useToast } from '@/hooks/use-toast';

interface Song {
  id: string;
  title: string;
  thumbnail: string;
  channelTitle: string;
  duration?: string;
}

const Music = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [songs, setSongs] = useState<Song[]>([]);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [favorites, setFavorites] = useLocalStorage<Song[]>('favorites', []);
  const [playlists, setPlaylists] = useLocalStorage<{[key: string]: Song[]}>('playlists', {});
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'search' | 'favorites' | 'playlists'>('search');
  const { mood } = useMoodTheme();
  const { toast } = useToast();

  // Mood-based default searches
  const moodPlaylists = {
    Happy: 'upbeat happy music',
    Sad: 'calming peaceful music',
    Anxious: 'relaxing anxiety relief music',
    Angry: 'calming meditation music',
  };

  const searchMusic = async (query: string) => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/youtube/search?q=${encodeURIComponent(query)}&maxResults=12`);
      
      if (!response.ok) {
        throw new Error('Search failed');
      }
      
      const data = await response.json();
      
      if (data.items) {
        const formattedSongs: Song[] = data.items.map((item: any) => ({
          id: item.id.videoId,
          title: item.snippet.title,
          thumbnail: item.snippet.thumbnails.medium.url,
          channelTitle: item.snippet.channelTitle,
        }));
        setSongs(formattedSongs);
      }
    } catch (error) {
      console.error('Search error:', error);
      // Fallback to dummy songs
      const dummySongs: Song[] = [
        {
          id: 'dQw4w9WgXcQ',
          title: 'Relaxing Piano Music',
          thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg',
          channelTitle: 'Calm Music Channel',
        },
        {
          id: 'jfKfPfyJRdk',
          title: 'Nature Sounds for Sleep',
          thumbnail: 'https://img.youtube.com/vi/jfKfPfyJRdk/mqdefault.jpg',
          channelTitle: 'Nature Sounds',
        },
        {
          id: 'YnuALiVzTcI',
          title: 'Meditation Music',
          thumbnail: 'https://img.youtube.com/vi/YnuALiVzTcI/mqdefault.jpg',
          channelTitle: 'Meditation Channel',
        },
      ];
      setSongs(dummySongs);
      toast({
        title: "Using offline content",
        description: "Showing curated songs while YouTube search is unavailable",
      });
    }
    setLoading(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchMusic(searchQuery);
  };

  const playSong = (song: Song) => {
    setCurrentSong(song);
  };

  const toggleFavorite = (song: Song) => {
    const isFavorite = favorites.some(fav => fav.id === song.id);
    if (isFavorite) {
      setFavorites(favorites.filter(fav => fav.id !== song.id));
      toast({ title: "Removed from favorites" });
    } else {
      setFavorites([...favorites, song]);
      toast({ title: "Added to favorites" });
    }
  };

  const createPlaylist = (name: string) => {
    if (playlists[name]) {
      toast({ title: "Playlist already exists", variant: "destructive" });
      return;
    }
    setPlaylists({ ...playlists, [name]: [] });
    toast({ title: `Created playlist: ${name}` });
  };

  const addToPlaylist = (playlistName: string, song: Song) => {
    const playlist = playlists[playlistName] || [];
    if (playlist.some(s => s.id === song.id)) {
      toast({ title: "Song already in playlist", variant: "destructive" });
      return;
    }
    setPlaylists({
      ...playlists,
      [playlistName]: [...playlist, song]
    });
    toast({ title: `Added to ${playlistName}` });
  };

  // Load mood-based music on component mount
  useEffect(() => {
    if (mood && moodPlaylists[mood as keyof typeof moodPlaylists]) {
      const moodQuery = moodPlaylists[mood as keyof typeof moodPlaylists];
      searchMusic(moodQuery);
      setSearchQuery(moodQuery);
    }
  }, [mood]);

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          🎵 Music Therapy
        </h1>
        <p className="text-lg text-gray-600">
          Discover music that matches your mood and supports your wellbeing
        </p>
      </div>

      {/* Music Player */}
      {currentSong && (
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="text-2xl">🎵</div>
              Now Playing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              <img
                src={currentSong.thumbnail}
                alt={currentSong.title}
                className="w-20 h-15 object-cover rounded"
              />
              <div>
                <h3 className="font-semibold">{currentSong.title}</h3>
                <p className="text-gray-600">{currentSong.channelTitle}</p>
              </div>
            </div>
            <div className="aspect-video bg-black rounded-lg overflow-hidden">
              <iframe
                src={`https://www.youtube.com/embed/${currentSong.id}?autoplay=1`}
                title={currentSong.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <div className="flex space-x-1 bg-white/50 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('search')}
          className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
            activeTab === 'search'
              ? 'bg-purple-600 text-white'
              : 'text-gray-600 hover:bg-white/80'
          }`}
        >
          🔍 Search
        </button>
        <button
          onClick={() => setActiveTab('favorites')}
          className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
            activeTab === 'favorites'
              ? 'bg-purple-600 text-white'
              : 'text-gray-600 hover:bg-white/80'
          }`}
        >
          ❤️ Favorites ({favorites.length})
        </button>
        <button
          onClick={() => setActiveTab('playlists')}
          className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
            activeTab === 'playlists'
              ? 'bg-purple-600 text-white'
              : 'text-gray-600 hover:bg-white/80'
          }`}
        >
          📝 Playlists ({Object.keys(playlists).length})
        </button>
      </div>

      {/* Search Tab */}
      {activeTab === 'search' && (
        <div className="space-y-6">
          <Card className="glass">
            <CardContent className="p-6">
              <form onSubmit={handleSearch} className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Search for music..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" disabled={loading}>
                  {loading ? 'Searching...' : 'Search'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Mood-based suggestions */}
          {mood && (
            <Card className="glass">
              <CardHeader>
                <CardTitle>Recommended for your mood: {mood}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 flex-wrap">
                  {['calming music', 'nature sounds', 'meditation music', 'peaceful piano'].map((suggestion) => (
                    <Button
                      key={suggestion}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSearchQuery(suggestion);
                        searchMusic(suggestion);
                      }}
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Search Results */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {songs.map((song) => (
              <Card key={song.id} className="glass hover:scale-105 transition-transform cursor-pointer">
                <CardContent className="p-4">
                  <img
                    src={song.thumbnail}
                    alt={song.title}
                    className="w-full h-32 object-cover rounded mb-3"
                  />
                  <h3 className="font-semibold text-sm line-clamp-2 mb-1">{song.title}</h3>
                  <p className="text-xs text-gray-600 mb-3">{song.channelTitle}</p>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      onClick={() => playSong(song)}
                      className="flex-1"
                    >
                      ▶️ Play
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleFavorite(song)}
                      className={favorites.some(fav => fav.id === song.id) ? 'text-red-500' : ''}
                    >
                      ❤️
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Favorites Tab */}
      {activeTab === 'favorites' && (
        <div className="space-y-4">
          {favorites.length === 0 ? (
            <Card className="glass">
              <CardContent className="p-8 text-center">
                <div className="text-4xl mb-4">💔</div>
                <h3 className="text-lg font-semibold mb-2">No favorites yet</h3>
                <p className="text-gray-600">Start searching for music and add songs to your favorites!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {favorites.map((song) => (
                <Card key={song.id} className="glass hover:scale-105 transition-transform cursor-pointer">
                  <CardContent className="p-4">
                    <img
                      src={song.thumbnail}
                      alt={song.title}
                      className="w-full h-32 object-cover rounded mb-3"
                    />
                    <h3 className="font-semibold text-sm line-clamp-2 mb-1">{song.title}</h3>
                    <p className="text-xs text-gray-600 mb-3">{song.channelTitle}</p>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        onClick={() => playSong(song)}
                        className="flex-1"
                      >
                        ▶️ Play
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleFavorite(song)}
                        className="text-red-500"
                      >
                        💔
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Playlists Tab */}
      {activeTab === 'playlists' && (
        <div className="space-y-4">
          <Card className="glass">
            <CardContent className="p-6">
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="New playlist name..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      const input = e.target as HTMLInputElement;
                      if (input.value.trim()) {
                        createPlaylist(input.value.trim());
                        input.value = '';
                      }
                    }
                  }}
                />
                <Button
                  onClick={(e) => {
                    const input = (e.target as HTMLElement).parentElement?.querySelector('input') as HTMLInputElement;
                    if (input?.value.trim()) {
                      createPlaylist(input.value.trim());
                      input.value = '';
                    }
                  }}
                >
                  Create
                </Button>
              </div>
            </CardContent>
          </Card>

          {Object.keys(playlists).length === 0 ? (
            <Card className="glass">
              <CardContent className="p-8 text-center">
                <div className="text-4xl mb-4">🎵</div>
                <h3 className="text-lg font-semibold mb-2">No playlists yet</h3>
                <p className="text-gray-600">Create your first playlist to organize your favorite songs!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(playlists).map(([name, songs]) => (
                <Card key={name} className="glass">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      📝 {name}
                      <span className="text-sm font-normal text-gray-600">
                        ({songs.length} songs)
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {songs.length === 0 ? (
                      <p className="text-gray-600 text-sm">Empty playlist</p>
                    ) : (
                      <div className="space-y-2">
                        {songs.slice(0, 3).map((song) => (
                          <div key={song.id} className="flex items-center gap-2">
                            <img
                              src={song.thumbnail}
                              alt={song.title}
                              className="w-8 h-6 object-cover rounded"
                            />
                            <span className="text-sm truncate">{song.title}</span>
                          </div>
                        ))}
                        {songs.length > 3 && (
                          <p className="text-xs text-gray-500">
                            +{songs.length - 3} more songs
                          </p>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Music;
