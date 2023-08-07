"use client"

import Modal from '@/app/components/Modal'
import { FC } from 'react'
import Image from 'next/image'

interface ImageModalProps {
    src?: string | null
    isOpen?: boolean
    onClose: () => void
}

const ImageModal: FC<ImageModalProps> = ({ src, isOpen, onClose }) => {
    if (!src) {
        return null
    }
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className='w-80 h-80'>
                <Image alt="Image" src={src} fill className='object-cover'/>
            </div>
        </Modal>
    )
}

export default ImageModal