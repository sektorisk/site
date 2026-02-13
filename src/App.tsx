import { useState, useEffect, useRef } from 'react';
import { 
  MapPin, 
  Newspaper, 
  Building2, 
  Flag, 
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Info,
  Clock,
  Map as MapIcon,
  Wallet,
  Users,
  Radio,
  Lock,
  Zap
} from 'lucide-react';
import './App.css';

type Section = 'hero' | 'news' | 'establishments' | 'races';

interface NewsItem {
  id: string;
  priority: 'critical' | 'info';
  timestamp: string;
  title: string;
  content: string;
  image: string;
  coords: string;
}

interface Establishment {
  id: string;
  name: string;
  type: string;
  location: string;
  description: string;
  secretInfo: string;
  image: string;
  status: 'active' | 'busy';
  lastActive: string;
}

interface Race {
  id: string;
  name: string;
  meetup: string;
  time: string;
  cameraStatus: string;
  class: string;
  prize: string;
  entrants: number;
  maxEntrants: number;
  image: string;
}

const newsData: NewsItem[] = [
  {
    id: '1',
    priority: 'critical',
    timestamp: '14.02.2026 | 03:47',
    title: 'ИНЦИДЕНТ В ПОРТОВОМ РАЙОНЕ',
    content: `Субъект №7 обнаружен в нейтральной зоне у причала №4. Группировка из северного порта подтвердила причастность к инциденту 12.02. 

По данным источника, конфликт возник из-за перераспределения маршрутов. Пострадавшие: 2 единицы. Статус: ликвидированы.

Рекомендация: избегать района до 06:00. Камеры наблюдения в секторе отключены.`,
    image: '/news-crime.jpg',
    coords: '34.0522° N, 118.2437° W'
  },
  {
    id: '2',
    priority: 'info',
    timestamp: '13.02.2026 | 21:15',
    title: 'ОБНОВЛЕНИЕ МАРШРУТОВ',
    content: `С 14.02 вводятся изменения в схеме передвижения по восточному шоссе. 

Контрольные точки:
- Чекпоинт А: перенесен на 2.3 км севернее
- Чекпоинт Б: временно закрыт (ремонт)
- Чекпоинт В: новая локация, координаты в защищенном канале

Все активные участники получили обновленные маршрутные листы.`,
    image: '/establishment-auto.jpg',
    coords: 'СИСТЕМНОЕ СООБЩЕНИЕ'
  },
  {
    id: '3',
    priority: 'critical',
    timestamp: '12.02.2026 | 14:22',
    title: 'ОПЕРАЦИЯ "ТИХИЙ ШЕПОТ"',
    content: `N.O.O.S.E. проводит зачистку в центральном районе. Агенты в гражданском. 

Зафиксировано:
- 4 патрульные машины (немаркированные)
- 2 вертолета на орбите
- Подразделение быстрого реагирования в standby

Безопасные зоны: северный порт, индустриальный район. Рекомендуется минимальная активность до 18:00.`,
    image: '/news-cleanup.jpg',
    coords: 'ТРЕВОГА: ВЫСОКИЙ РИСК'
  }
];

const establishmentsData: Establishment[] = [
  {
    id: '1',
    name: "HOG'S PUB",
    type: 'КАНАЛ: БАР',
    location: 'Зеркальный парк',
    description: 'Традиционный паб с усиленной звукоизоляцией. Задняя комната доступна по паролю.',
    secretInfo: 'Здесь можно сбыть товар. Контакт: бармен после 02:00. Пароль: "Тихий шепот".',
    image: '/establishment-hogs.jpg',
    status: 'active',
    lastActive: '2 мин назад'
  },
  {
    id: '2',
    name: 'TEQUI-LA-LA',
    type: 'КАНАЛ: КЛУБ',
    location: 'Вайнвуд',
    description: 'Подпольный рок-клуб. Сцена, бар, толпа. Идеальное прикрытие для встреч.',
    secretInfo: 'Безопасная зона для встреч. Гримерка #3 — нейтральная территория. Камеры отключены с 00:00 до 06:00.',
    image: '/establishment-tequi.jpg',
    status: 'active',
    lastActive: '15 мин назад'
  },
  {
    id: '3',
    name: 'ЦЕНТРАЛЬНОЕ АТЕЛЬЕ',
    type: 'КАНАЛ: ТЮНИНГ',
    location: 'Строберри',
    description: 'Полный спектр услуг: от перетяжки салона до смены VIN.',
    secretInfo: 'Гараж #2 — бронирование под "особые проекты". Срок: от 3 дней. Оплата: крипта.',
    image: '/establishment-auto.jpg',
    status: 'busy',
    lastActive: '1 час назад'
  }
];

const racesData: Race[] = [
  {
    id: '1',
    name: 'NIGHT RUN: DOWNTOWN',
    meetup: '34.0407° N, 118.2468° W',
    time: '02:00',
    cameraStatus: 'ВЫКЛЮЧЕНЫ (02:00-04:30)',
    class: 'SPORT / 3.0L+ / RWD',
    prize: '12.5 BTC',
    entrants: 8,
    maxEntrants: 12,
    image: '/race-meet.jpg'
  },
  {
    id: '2',
    name: 'DRIFT CIRCUIT: DOCKS',
    meetup: '33.9850° N, 118.2700° W',
    time: '00:30',
    cameraStatus: 'СЛЕПЫЕ ЗОНЫ',
    class: 'TUNER / 2.0L-3.0L / RWD',
    prize: '8.2 BTC',
    entrants: 6,
    maxEntrants: 8,
    image: '/race-drift.jpg'
  },
  {
    id: '3',
    name: 'HIGHWAY SPRINT',
    meetup: '34.1200° N, 118.2000° W',
    time: '01:15',
    cameraStatus: 'РЕЖИМ ОБСЛУЖИВАНИЯ',
    class: 'SUPER / 4.0L+ / AWD',
    prize: '25.0 BTC',
    entrants: 4,
    maxEntrants: 6,
    image: '/race-speed.jpg'
  }
];

const useTypewriter = (text: string, speed: number = 15, start: boolean = true) => {
  const [displayText, setDisplayText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!start) {
      setDisplayText(text);
      setIsComplete(true);
      return;
    }
    
    let index = 0;
    setDisplayText('');
    setIsComplete(false);
    
    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayText(text.slice(0, index + 1));
        index++;
      } else {
        setIsComplete(true);
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed, start]);

  return { displayText, isComplete };
};

const NewsCard = ({ news, isActive }: { news: NewsItem; isActive: boolean }) => {
  const { displayText, isComplete } = useTypewriter(news.content, 12, isActive);

  return (
    <div className={`gunmetal-panel rounded-lg overflow-hidden transition-all duration-500 ${
      isActive ? 'opacity-100 scale-100' : 'opacity-50 scale-95'
    }`}>
      <div className="relative h-48 overflow-hidden">
        <img 
          src={news.image} 
          alt="" 
          className="w-full h-full object-cover grayscale contrast-125"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-transparent" />
        
        <div className={`absolute top-4 left-4 px-3 py-1 rounded text-xs font-mono uppercase tracking-wider ${
          news.priority === 'critical' ? 'status-critical' : 'status-info'
        }`}>
          {news.priority === 'critical' ? (
            <span className="flex items-center gap-1">
              <AlertTriangle size={12} />
              КРИТИЧНО
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <Info size={12} />
              ИНФОРМАТИВНО
            </span>
          )}
        </div>
        
        <div className="absolute top-4 right-4 text-xs font-mono text-gray-500">
          {news.timestamp}
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3 text-xs font-mono text-gray-500">
          <MapIcon size={12} />
          <span>{news.coords}</span>
        </div>
        
        <h3 className="font-display text-xl text-gray-200 mb-4">{news.title}</h3>
        
        <div className="font-mono text-sm text-gray-400 leading-relaxed whitespace-pre-line">
          {isActive ? displayText : news.content.slice(0, 120) + '...'}
          {isActive && !isComplete && <span className="text-amber animate-pulse">█</span>}
        </div>
        
        {!isComplete && isActive && (
          <div className="mt-2 text-xs text-amber/60 font-mono">
            [ПОЛУЧЕНИЕ ДАННЫХ...]
          </div>
        )}
      </div>
    </div>
  );
};

const EstablishmentCard = ({ 
  establishment, 
  isActive, 
  onClick 
}: { 
  establishment: Establishment; 
  isActive: boolean;
  onClick: () => void;
}) => {
  return (
    <div 
      onClick={onClick}
      className={`relative gunmetal-panel rounded-lg overflow-hidden cursor-pointer transition-all duration-300 ${
        isActive ? 'channel-active scale-105' : 'hover:scale-102'
      }`}
    >
      <div className="relative h-56 overflow-hidden">
        <img 
          src={establishment.image} 
          alt="" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/50 to-transparent" />
        
        <div className="absolute top-4 left-4">
          <div className={`px-2 py-1 rounded text-xs font-mono uppercase ${
            establishment.status === 'active' 
              ? 'bg-amber/20 text-amber border border-amber/40' 
              : 'bg-gray-700/50 text-gray-400 border border-gray-600'
          }`}>
            {establishment.status === 'active' ? (
              <span className="flex items-center gap-1">
                <Zap size={10} />
                АКТИВЕН
              </span>
            ) : (
              <span>ЗАНЯТ</span>
            )}
          </div>
        </div>
        
        <div className="absolute top-4 right-4 text-xs font-mono text-gray-500">
          {establishment.lastActive}
        </div>
      </div>
      
      <div className="p-5">
        <div className="text-xs font-mono text-gray-500 mb-2 uppercase tracking-wider">
          {establishment.type}
        </div>
        
        <h3 className="font-display text-lg text-gray-200 mb-1">{establishment.name}</h3>
        
        <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
          <MapPin size={12} />
          <span>{establishment.location}</span>
        </div>
        
        <p className="text-sm text-gray-400">{establishment.description}</p>
        
        <div className={`overflow-hidden transition-all duration-500 ${
          isActive ? 'max-h-40 mt-4 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="p-3 bg-wine/10 border border-wine/30 rounded">
            <div className="flex items-center gap-2 mb-2 text-wine text-xs font-mono uppercase">
              <Lock size={12} />
              <span>РАСШИФРОВАНО</span>
            </div>
            <p className="text-sm text-gray-300 font-mono">{establishment.secretInfo}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const RaceCard = ({ race }: { race: Race }) => {
  return (
    <div className="gunmetal-panel rounded-lg overflow-hidden">
      <div className="relative h-40 overflow-hidden">
        <img 
          src={race.image} 
          alt="" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/60 to-transparent" />
        
        <div className="absolute top-4 right-4 px-3 py-1 bg-amber/20 border border-amber/40 rounded">
          <span className="text-amber font-mono text-sm font-bold">{race.prize}</span>
        </div>
      </div>
      
      <div className="p-5">
        <h3 className="font-display text-lg text-gray-200 mb-4">{race.name}</h3>
        
        <div className="space-y-3 font-mono text-sm">
          <div className="flex items-start gap-3">
            <MapPin size={14} className="text-gray-500 mt-0.5" />
            <div>
              <div className="text-gray-500 text-xs uppercase">Точка сбора</div>
              <div className="text-gray-300">{race.meetup}</div>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Clock size={14} className="text-gray-500 mt-0.5" />
            <div>
              <div className="text-gray-500 text-xs uppercase">Старт</div>
              <div className="text-gray-300">{race.time}</div>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Radio size={14} className="text-wine mt-0.5" />
            <div>
              <div className="text-gray-500 text-xs uppercase">Камеры</div>
              <div className="text-wine">{race.cameraStatus}</div>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="text-gray-500 text-xs uppercase w-20">Класс</div>
            <div className="text-gray-300">{race.class}</div>
          </div>
          
          <div className="flex items-start gap-3">
            <Users size={14} className="text-gray-500 mt-0.5" />
            <div>
              <div className="text-gray-500 text-xs uppercase">Участники</div>
              <div className="text-gray-300">{race.entrants} / {race.maxEntrants}</div>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Wallet size={14} className="text-amber mt-0.5" />
            <div>
              <div className="text-gray-500 text-xs uppercase">Призовой фонд</div>
              <div className="text-amber font-bold">{race.prize}</div>
              <div className="text-xs text-gray-500">Формируется через крипто-кошельки</div>
            </div>
          </div>
        </div>
        
        <button className="mt-5 w-full py-3 bg-gunmetal hover:bg-wine/20 border border-gray-700 hover:border-wine/50 text-gray-300 hover:text-gray-200 font-mono text-sm uppercase tracking-wider transition-all duration-300">
          ПОДАТЬ ЗАЯВКУ
        </button>
      </div>
    </div>
  );
};

const ScrollCar = ({ progress }: { progress: number }) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-30 opacity-40">
      <svg className="w-full h-full" viewBox="0 0 1400 800" preserveAspectRatio="none">
        <path
          d="M 100 600 Q 400 600, 500 500 Q 600 400, 800 450 Q 1000 500, 1100 350 Q 1200 200, 1300 250"
          fill="none"
          stroke="rgba(184, 115, 51, 0.2)"
          strokeWidth="2"
          strokeDasharray="8 4"
        />
        
        <g 
          style={{
            transform: `translate(${100 + progress * 1200}px, ${600 - progress * 400 + Math.sin(progress * Math.PI * 2) * 50}px)`,
            transition: 'transform 0.05s linear'
          }}
        >
          <polygon 
            points="0,8 20,0 40,8 40,16 32,20 8,20 0,16" 
            fill="#1a1c20"
            stroke="#b87333"
            strokeWidth="1.5"
          />
          <circle cx="35" cy="12" r="2" fill="#fbbf24" className="animate-pulse" />
          <circle cx="5" cy="12" r="2" fill="#dc2626" className="animate-pulse" />
        </g>
      </svg>
    </div>
  );
};

function App() {
  const [activeSection, setActiveSection] = useState<Section>('hero');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeNewsIndex, setActiveNewsIndex] = useState(0);
  const [activeEstIndex, setActiveEstIndex] = useState(0);
  
  const heroRef = useRef<HTMLDivElement>(null);
  const newsRef = useRef<HTMLDivElement>(null);
  const estRef = useRef<HTMLDivElement>(null);
  const racesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(scrollY / docHeight, 1);
      setScrollProgress(progress);
      
      const sections = [
        { ref: heroRef, id: 'hero' as Section },
        { ref: newsRef, id: 'news' as Section },
        { ref: estRef, id: 'establishments' as Section },
        { ref: racesRef, id: 'races' as Section }
      ];
      
      for (const section of sections) {
        if (section.ref.current) {
          const rect = section.ref.current.getBoundingClientRect();
          if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-charcoal text-gray-300 relative">
      <div className="fixed inset-0 pointer-events-none z-50 crt-overlay opacity-20" />
      
      <ScrollCar progress={scrollProgress} />
      
      <header className="fixed top-0 left-0 right-0 z-40 glass-dark border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/skull-logo.png" alt="" className="w-8 h-8 opacity-80" />
            <div>
              <h1 className="font-display text-sm tracking-widest text-gray-200">СЕКТОР ТИШИНЫ</h1>
              <p className="text-[10px] font-mono text-gray-500">LOS SANTOS UNDERWORLD</p>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            {[
              { label: 'НОВОСТИ', ref: newsRef, id: 'news' },
              { label: 'ЗАВЕДЕНИЯ', ref: estRef, id: 'establishments' },
              { label: 'ГОНКИ', ref: racesRef, id: 'races' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.ref)}
                className={`text-xs font-mono tracking-wider transition-all duration-300 ${
                  activeSection === item.id ? 'text-amber' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
          
          <div className="flex items-center gap-2 text-xs font-mono">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-gray-500">ONLINE</span>
          </div>
        </div>
      </header>

      <section ref={heroRef} className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0">
          <img src="/blueprint-map.jpg" alt="" className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal via-transparent to-charcoal" />
        </div>
        
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(rgba(184, 115, 51, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(184, 115, 51, 0.3) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />
        
        <div className="relative z-10 text-center px-6">
          <div className="mb-8">
            <img src="/skull-logo.png" alt="" className="w-24 h-24 mx-auto opacity-60" />
          </div>
          
          <h1 className="font-display text-5xl md:text-7xl text-gray-200 mb-4 tracking-wider">СЕКТОР ТИШИНЫ</h1>
          
          <p className="font-mono text-sm text-gray-500 mb-2">АНОНИМНЫЙ ПОРТАЛ-АГРЕГАТОР</p>
          <p className="font-mono text-xs text-amber/60 mb-12">LOS SANTOS UNDERWORLD v2.4.7</p>
          
          <div className="flex flex-col items-center gap-4">
            <p className="text-gray-400 text-sm max-w-md">Анонимные сводки. Закрытые каналы. Нелегальные заезды.</p>
            
            <button 
              onClick={() => scrollToSection(newsRef)}
              className="mt-8 px-8 py-3 bg-gunmetal border border-gray-700 hover:border-amber/50 text-gray-300 hover:text-amber font-mono text-sm uppercase tracking-wider transition-all duration-300"
            >
              ВОЙТИ В СИСТЕМУ
            </button>
          </div>
        </div>
        
        <div className="absolute bottom-8 left-8 text-xs font-mono text-gray-600">COORDS: 34.0522° N, 118.2437° W</div>
        <div className="absolute bottom-8 right-8 text-xs font-mono text-gray-600">ENCRYPTED CONNECTION</div>
      </section>

      <section ref={newsRef} className="min-h-screen py-24 relative">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <Newspaper size={20} className="text-wine" />
              <h2 className="font-display text-3xl text-gray-200">АНОНИМНЫЕ СВОДКИ</h2>
            </div>
            <p className="font-mono text-sm text-gray-500">Деперсонализированные отчеты из полевых источников</p>
          </div>
          
          <div className="relative">
            <div className="flex justify-between items-center mb-6">
              <button 
                onClick={() => setActiveNewsIndex(Math.max(0, activeNewsIndex - 1))}
                disabled={activeNewsIndex === 0}
                className="p-2 bg-gunmetal border border-gray-700 hover:border-amber/50 disabled:opacity-30 transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              
              <div className="flex gap-2">
                {newsData.map((_, i) => (
                  <div 
                    key={i}
                    className={`w-2 h-2 rounded-full transition-colors ${i === activeNewsIndex ? 'bg-amber' : 'bg-gray-700'}`}
                  />
                ))}
              </div>
              
              <button 
                onClick={() => setActiveNewsIndex(Math.min(newsData.length - 1, activeNewsIndex + 1))}
                disabled={activeNewsIndex === newsData.length - 1}
                className="p-2 bg-gunmetal border border-gray-700 hover:border-amber/50 disabled:opacity-30 transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {newsData.map((news, i) => (
                <div key={news.id} onClick={() => setActiveNewsIndex(i)} className="cursor-pointer">
                  <NewsCard news={news} isActive={i === activeNewsIndex} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section ref={estRef} className="min-h-screen py-24 relative bg-gunmetal/30">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <Building2 size={20} className="text-amber" />
              <h2 className="font-display text-3xl text-gray-200">ЗАВЕДЕНИЯ</h2>
            </div>
            <p className="font-mono text-sm text-gray-500">Закрытые каналы связи и безопасные зоны</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {establishmentsData.map((est, i) => (
              <EstablishmentCard 
                key={est.id}
                establishment={est}
                isActive={i === activeEstIndex}
                onClick={() => setActiveEstIndex(i)}
              />
            ))}
          </div>
          
          <div className="mt-8 flex justify-center gap-6 text-xs font-mono">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-amber/20 border border-amber/40 rounded" />
              <span className="text-gray-500">АКТИВЕН — канал открыт</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-700 border border-gray-600 rounded" />
              <span className="text-gray-500">ЗАНЯТ — временно недоступен</span>
            </div>
          </div>
        </div>
      </section>

      <section ref={racesRef} className="min-h-screen py-24 relative">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <Flag size={20} className="text-amber" />
              <h2 className="font-display text-3xl text-gray-200">НЕЛЕГАЛЬНЫЕ ЗАЕЗДЫ</h2>
            </div>
            <p className="font-mono text-sm text-gray-500">Технические детали и координаты точек сбора</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {racesData.map((race) => (
              <RaceCard key={race.id} race={race} />
            ))}
          </div>
          
          <div className="mt-12 p-6 border border-wine/30 bg-wine/5 rounded-lg">
            <div className="flex items-start gap-4">
              <AlertTriangle size={24} className="text-wine flex-shrink-0" />
              <div>
                <h4 className="font-display text-wine mb-2">ПРЕДУПРЕЖДЕНИЕ</h4>
                <p className="font-mono text-sm text-gray-400">
                  Все заезды проводятся на страх и риск участников. Организаторы не несут ответственности 
                  за повреждение имущества, травмы или задержание правоохранительными органами. 
                  Призовой фонд формируется анонимно через криптовалютные кошельки и не подлежит отслеживанию.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12 border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <img src="/skull-logo.png" alt="" className="w-6 h-6 opacity-50" />
              <div>
                <p className="font-display text-sm text-gray-400">СЕКТОР ТИШИНЫ</p>
                <p className="text-[10px] font-mono text-gray-600">LOS SANTOS UNDERWORLD</p>
              </div>
            </div>
            
            <div className="text-xs font-mono text-gray-600 text-center">
              <p>Анонимный портал-агрегатор криминальных новостей и услуг</p>
              <p className="mt-1">Все данные передаются через зашифрованные каналы</p>
            </div>
            
            <div className="text-xs font-mono text-gray-600">
              <p>v2.4.7 | BUILD 2026.02.14</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
