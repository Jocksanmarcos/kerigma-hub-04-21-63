import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Heart, Users } from 'lucide-react';

interface PersonalizedWelcomeModalProps {
  isOpen: boolean;
  onResponse: (isFirstTime: boolean) => void;
  onClose: () => void;
}

export const PersonalizedWelcomeModal: React.FC<PersonalizedWelcomeModalProps> = ({
  isOpen,
  onResponse,
  onClose,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="max-w-md mx-auto border-0 bg-card/95 backdrop-blur-lg shadow-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="text-center space-y-6 p-6"
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
              >
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Bem-vindo à CBN Kerigma! 
                </h2>
                <p className="text-muted-foreground">
                  É a sua primeira vez aqui?
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="flex flex-col sm:flex-row gap-3"
              >
                <Button
                  onClick={() => onResponse(true)}
                  variant="default"
                  className="flex-1 gap-2 h-12"
                >
                  <Heart className="w-4 h-4" />
                  Sim, primeira vez
                </Button>
                <Button
                  onClick={() => onResponse(false)}
                  variant="outline"
                  className="flex-1 gap-2 h-12"
                >
                  <Users className="w-4 h-4" />
                  Já nos conhecemos
                </Button>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.3 }}
                className="text-xs text-muted-foreground"
              >
                Isso nos ajuda a personalizar sua experiência
              </motion.p>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};