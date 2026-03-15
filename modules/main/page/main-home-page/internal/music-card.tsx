'use client'

import { Pause, Play, SkipBack, SkipForward, Volume2 } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface Track {
  title: string
  subtitle: string
  accent: string
  src: string
}

const tracks: Track[] = [
  {
    title: '我怀念的',
    subtitle: '孙燕姿',
    accent: '#57b8ab',
    src: '/music/我怀念的 - 孙燕姿.mp3',
  },
  {
    title: '把回忆拼好给你',
    subtitle: '王贰浪',
    accent: '#8daad3',
    src: '/music/把回忆拼好给你 - 王贰浪.mp3',
  },
  {
    title: '阳光下的星星',
    subtitle: '金海心',
    accent: '#d7a86e',
    src: '/music/阳光下的星星 - 金海心.mp3',
  },
]

function clampVolume(value: number) {
  return Math.min(1, Math.max(0, value))
}

function formatTime(value: number) {
  if (!Number.isFinite(value))
    return '00:00'

  const minutes = Math.floor(value / 60)
  const seconds = Math.floor(value % 60)
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

function getAudioMimeType(src: string) {
  if (src.endsWith('.mp3'))
    return 'audio/mpeg'
  if (src.endsWith('.m4a'))
    return 'audio/mp4'
  if (src.endsWith('.ogg'))
    return 'audio/ogg'
  if (src.endsWith('.wav'))
    return 'audio/wav'
  return 'audio/mpeg'
}

export default function MusicCard() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const isPlayingRef = useRef(false)

  const [trackIndex, setTrackIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.58)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [audioError, setAudioError] = useState<string | null>(null)

  const activeTrack = tracks[trackIndex]

  useEffect(() => {
    isPlayingRef.current = isPlaying
  }, [isPlaying])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio)
      return

    audio.volume = volume
  }, [volume])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio)
      return

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0)
      setCurrentTime(audio.currentTime || 0)
      setAudioError(null)
    }

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
    }

    const handleEnded = () => {
      setIsPlaying(false)
      setCurrentTime(0)
    }

    const handleError = () => {
      setAudioError('音频文件加载失败，请检查 public/music 下的资源。')
      setIsPlaying(false)
    }

    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('error', handleError)

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('error', handleError)
    }
  }, [])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio)
      return

    const shouldResume = isPlayingRef.current

    audio.pause()
    audio.load()
    setCurrentTime(0)
    setDuration(0)
    setAudioError(null)

    if (!shouldResume)
      return

    void audio.play().catch(() => {
      setIsPlaying(false)
      setAudioError('当前浏览器拦截了自动播放，请再点一次播放。')
    })
  }, [trackIndex])

  const bars = useMemo(() => (
    Array.from({ length: 14 }, (_, index) => {
      const pulse = isPlaying
        ? 0.35 + Math.abs(Math.sin(currentTime * 3.2 + index * 0.7)) * 0.65
        : 0.18 + ((index % 4) * 0.07)
      return Math.round(24 + pulse * 96)
    })
  ), [currentTime, isPlaying])

  const handleToggle = async () => {
    const audio = audioRef.current
    if (!audio)
      return

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
      return
    }

    try {
      await audio.play()
      setIsPlaying(true)
      setAudioError(null)
    }
    catch {
      setAudioError('播放失败，请确认浏览器允许此页面播放音频。')
    }
  }

  const switchTrack = (direction: 1 | -1) => {
    const nextIndex = (trackIndex + direction + tracks.length) % tracks.length
    setTrackIndex(nextIndex)
  }

  const handleVolumeChange = (nextVolume: number) => {
    const normalizedVolume = clampVolume(nextVolume)
    setVolume(normalizedVolume)
  }

  const handleSeek = (nextValue: number) => {
    const audio = audioRef.current
    if (!audio || !Number.isFinite(duration))
      return

    audio.currentTime = nextValue
    setCurrentTime(nextValue)
  }

  return (
    <section className="paper-card relative overflow-hidden p-6 md:p-8">
      <audio ref={audioRef} preload="metadata">
        <source src={activeTrack.src} type={getAudioMimeType(activeTrack.src)} />
      </audio>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(87,184,171,0.16),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(141,170,211,0.14),_transparent_30%)] dark:bg-[radial-gradient(circle_at_top_left,_rgba(87,184,171,0.14),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(141,170,211,0.08),_transparent_28%)]" />

      <div className="relative">
        <div className="flex items-center justify-between gap-3">
          <span className="paper-label">music room</span>
          <span className="text-xs uppercase tracking-[0.22em] text-foreground/40">real audio files</span>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-[minmax(0,1fr)_148px] md:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-foreground/40">{activeTrack.subtitle}</p>
            <h3 className="paper-title mt-3 text-2xl md:text-3xl">{activeTrack.title}</h3>
            <p className="mt-3 max-w-xl text-sm leading-7 text-foreground/68 md:text-base">
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => void switchTrack(-1)}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/85 bg-white/80 text-foreground transition-transform hover:-translate-y-0.5 dark:border-white/12 dark:bg-white/[0.06]"
                aria-label="上一首"
              >
                <SkipBack className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => void handleToggle()}
                className="flex h-12 min-w-[136px] items-center justify-center gap-2 rounded-full border border-white/85 bg-white/85 px-5 text-sm font-medium text-primary transition-transform hover:-translate-y-0.5 dark:border-white/12 dark:bg-white/[0.06] dark:text-white/85"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {isPlaying ? 'Pause Track' : 'Play Track'}
              </button>
              <button
                type="button"
                onClick={() => void switchTrack(1)}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/85 bg-white/80 text-foreground transition-transform hover:-translate-y-0.5 dark:border-white/12 dark:bg-white/[0.06]"
                aria-label="下一首"
              >
                <SkipForward className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-[0.18em] text-foreground/42">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
              <input
                type="range"
                min="0"
                max={duration || 0}
                step="0.1"
                value={Math.min(currentTime, duration || 0)}
                onChange={event => handleSeek(Number(event.target.value))}
                className="h-2 w-full cursor-pointer appearance-none rounded-full bg-black/8 accent-[#57b8ab] dark:bg-white/10"
                aria-label="播放进度"
              />
            </div>

            <div className="mt-5 flex items-center gap-3">
              <Volume2 className="h-4 w-4 text-foreground/48" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={event => handleVolumeChange(Number(event.target.value))}
                className="h-2 w-full cursor-pointer appearance-none rounded-full bg-black/8 accent-[#57b8ab] dark:bg-white/10"
                aria-label="音量"
              />
              <span className="w-10 text-right text-xs uppercase tracking-[0.16em] text-foreground/42">
                {`${Math.round(volume * 100)}%`}
              </span>
            </div>

            {audioError && (
              <p className="mt-4 text-sm text-[#c86b5a] dark:text-[#ef9c8d]">{audioError}</p>
            )}
          </div>

          <div className="rounded-[28px] border border-black/6 bg-black/[0.03] p-4 dark:border-white/10 dark:bg-white/[0.03]">
            <div className="flex h-[172px] items-end justify-between gap-2">
              {bars.map((bar, index) => (
                <span
                  key={`${bar}-${index}`}
                  className={cn(
                    'block w-full rounded-full transition-[height,opacity,background-color] duration-200',
                    isPlaying ? 'opacity-100' : 'opacity-45',
                  )}
                  style={{
                    height: `${bar}px`,
                    background: isPlaying ? activeTrack.accent : 'rgba(120, 139, 145, 0.26)',
                  }}
                />
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between text-xs uppercase tracking-[0.24em] text-foreground/42">
              <span>status</span>
              <span>{isPlaying ? 'playing' : 'paused'}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
