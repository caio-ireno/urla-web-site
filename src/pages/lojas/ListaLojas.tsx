import {
  Button,
  CircularProgress,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { Box } from '@mui/system'
import React, { useEffect, useState } from 'react'

import { useDebounce } from '../../shared/hooks'
import { LayoutBaseDePagina } from '../../shared/layouts'
import {
  LojasProps,
  LojasServices,
} from '../../shared/services/api/lojas/LojasService'

export const ListaLojas: React.FC = () => {
  const theme = useTheme()
  const smDown = useMediaQuery(theme.breakpoints.down('sm'))
  const mdDown = useMediaQuery(theme.breakpoints.down('md'))
  const { debounce } = useDebounce()
  const [rows, setRows] = useState<LojasProps[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    debounce(() => {
      LojasServices.getAll().then(result => {
        setIsLoading(false)
        if (result instanceof Error) {
          alert(result.message)
          return
        } else {
          console.log(result)

          setRows(result.data)
        }
      })
    })
  }, [])

  return (
    <LayoutBaseDePagina>
      <Box>
        <Box
          width={'100%'}
          height="300px"
          sx={{
            objectFit: 'cover',
          }}
          component="img"
          src="https://i.ibb.co/bbbfs63/1000-F-437219552-rykp-Z7e-VCDLrd-N8-QEI6-Ki-Te-Xo-Spe7-Bno.jpg"
        />
      </Box>

      {isLoading && (
        <Box
          p={10}
          display="flex"
          alignItems={'center'}
          justifyContent="center"
        >
          <CircularProgress />
        </Box>
      )}

      {!isLoading && (
        <Box
          padding={1}
          sx={{
            backgroundColor: '#F2F4F4 ',
          }}
          pt={2}
          pb={2}
          display={'flex'}
          flexWrap={'wrap'}
          alignItems="center"
          justifyContent={'center'}
          flexDirection="row"
          gap={2}
        >
          {rows.map(row => (
            <Box
              display="flex"
              justifyContent={'center'}
              alignItems="center"
              marginBottom={5}
              key={row.id}
              gap={2}
              width="500px"
              //border="1px solid"
              p={1}
            >
              <Box
                borderRadius={'5px'}
                display={smDown ? 'none' : ''}
                flexBasis="40%"
                flexGrow={1}
                maxWidth="40%"
                // width="200px"
                // width={smDown ? '200px' : mdDown ? '180px' : '200px'}
                height={smDown ? '200px' : mdDown ? '180px' : '200px'}
                component="img"
                sx={{
                  objectFit: 'cover',
                }}
                src={row.imgLoja}
              />

              <Box
                padding={1}
                gap={1}
                display={'flex'}
                flexBasis="60%"
                flexGrow={1}
                maxWidth="60%"
                flexWrap="wrap"
                flexDirection="column"
                alignItems={'start'}
                justifyContent="space-between"
              >
                <Box
                  display={'flex'}
                  alignItems="start"
                  flexDirection={'column'}
                  gap={smDown ? 1 : mdDown ? 2 : 2}
                >
                  <Typography
                    fontWeight={'bold'}
                    variant={smDown ? 'h6' : mdDown ? 'h5' : 'h4'}
                  >
                    {row.nomeLoja}
                  </Typography>
                  <Typography
                    sx={{ color: '#5F6A6A' }}
                    variant={'body1'}
                    display="flex"
                    flexWrap="wrap"
                  >
                    {row.endereço}
                  </Typography>

                  <Typography sx={{ color: '#5F6A6A' }}>
                    {row.telefone}
                  </Typography>
                </Box>

                <Button
                  sx={{ width: '100%' }}
                  variant="contained"
                  href={row.rota}
                >
                  Rota
                </Button>
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </LayoutBaseDePagina>
  )
}
