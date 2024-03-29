import {
  Box,
  CircularProgress,
  ListItemButton,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import {
  useMatch,
  useNavigate,
  useParams,
  useResolvedPath,
} from 'react-router-dom'

import { useDebounce } from '../../shared/hooks'
import { LayoutBaseDePagina } from '../../shared/layouts'
import {
  AllTypes,
  SorveteProps,
} from '../../shared/services/api/sorvete/AllTypes'

interface ListItemLinkProps {
  label: string
  to: string
}

const ListItemLink: React.FC<ListItemLinkProps> = ({ to, label }) => {
  const theme = useTheme()
  const mdDown = useMediaQuery(theme.breakpoints.down('md'))
  const smDown = useMediaQuery(theme.breakpoints.down('sm'))
  const navigate = useNavigate()

  const resolvedPath = useResolvedPath(to)
  const pathName = resolvedPath.pathname.replace('/sorvete/', '')
  const match = useMatch({ path: pathName, end: false })

  const handleClick = () => {
    navigate(to)
  }
  return (
    <Box
      display={'flex'}
      sx={{
        ':hover': {
          backgroundColor: '#fff',
          textDecorationLine: 'underline',
          textDecorationColor: '#5DADE2',
          textDecorationThickness: '5px ',
          textDecorationSkipInk: 'none',
        },
      }}
      onClick={handleClick}
    >
      <Typography
        selected={!!match}
        component={ListItemButton}
        fontSize={smDown ? 12 : mdDown ? 15 : 20}
        fontWeight={'bold'}
      >
        {label}
      </Typography>
    </Box>
  )
}

interface ListaSorvetelProps {
  children?: React.ReactNode
}
export const ListaSorvetes: React.FC<ListaSorvetelProps> = () => {
  const { debounce } = useDebounce()
  const theme = useTheme()
  const smDown = useMediaQuery(theme.breakpoints.down('sm'))
  const mdDown = useMediaQuery(theme.breakpoints.down('md'))
  const [rows, setRows] = useState<SorveteProps[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { idOrName } = useParams()

  useEffect(() => {
    debounce(() => {
      AllTypes.getAll().then(result => {
        setIsLoading(false)
        if (result instanceof Error) {
          alert(result.message)
          return
        } else {
          setRows(result.data)
        }
      })
    })
  }, [])

  const results = rows
    .filter(row => row.tipo === idOrName)
    .flatMap(row => row.sabores)

  return (
    <LayoutBaseDePagina>
      <Box>
        <Box
          width={'100%'}
          height="250px"
          sx={{
            objectFit: 'cover',
          }}
          component="img"
          src="https://i.ibb.co/qCpkZ77/1000-F-323631075-n-Cr-PGFR1-T3-Hja-Z9-Hd-S5-RU6-Qjx-Ajaub-WY-transformed.jpg"
        />
      </Box>

      <Box
        borderBottom={'1px solid'}
        width={'100%'}
        display={'flex'}
        flexDirection="row"
        justifyContent={'center'}
        alignItems="center"
        flexWrap={'wrap'}
        mt={mdDown ? 5 : 10}
        gap={mdDown ? 1 : 3}
      >
        {rows.map(row => (
          <Box key={row.id}>
            <ListItemLink to={`/sorvetes/${row.tipo}`} label={row.tipo} />
          </Box>
        ))}
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
          sx={{
            backgroundColor: '#F2F4F4 ',
          }}
          pt={10}
          pb={10}
          display={'flex'}
          flexWrap={'wrap'}
          alignItems="center"
          justifyContent={'center'}
          flexDirection="row"
          gap={5}
        >
          {results.flat().map(result => (
            <Box
              sx={{ backgroundColor: '#fff' }}
              p={1}
              width={'500px'}
              height={smDown ? 'auto' : 'auto'}
              justifyContent={'space-between'}
              key={result.id}
              display="flex"
              flexDirection={'row'}
              border="1px solid"
              borderRadius={2}
            >
              <Box>
                <Typography
                  fontWeight={'bold'}
                  fontSize={smDown ? 15 : mdDown ? 20 : 25}
                >
                  {result.nome}
                </Typography>
                <Typography fontSize={smDown ? 12 : mdDown ? 15 : 20}>
                  {result.descricao}
                </Typography>
              </Box>
              <Box display="flex" alignItems={'center'} justifyContent="center">
                <Box
                  sx={{
                    height: smDown ? '100px' : '200px',
                    width: smDown ? theme.spacing(15) : theme.spacing(24),
                  }}
                  component="img"
                  borderRadius={2}
                  src={result.imagem}
                />
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </LayoutBaseDePagina>
  )
}
