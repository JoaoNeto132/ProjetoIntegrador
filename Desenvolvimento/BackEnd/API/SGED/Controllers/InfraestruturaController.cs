﻿using SGED.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Reflection.Metadata.Ecma335;
using Microsoft.AspNetCore.Authorization;
using SGED.Objects.DTO.Entities;
using SGED.Objects.Utilities;

namespace SGED.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class InfraestruturaController : Controller
    {
        private readonly ITipoInfraestruturaService _tipoInfraestruturaService;
        private readonly IInfraestruturaService _infraestruturaService;
        private readonly Response _response;

        public InfraestruturaController(ITipoInfraestruturaService tipoInfraestruturaService, IInfraestruturaService infraestruturaService)
        {
            _tipoInfraestruturaService = tipoInfraestruturaService;
            _infraestruturaService = infraestruturaService;

            _response = new Response();
        }

        [HttpGet()]
        public async Task<ActionResult<IEnumerable<InfraestruturaDTO>>> Get()
        {
            try
            {
                var infraestruturasDTO = await _infraestruturaService.GetAll();
                _response.SetSuccess(); _response.Data = infraestruturasDTO;
                _response.Message = infraestruturasDTO.Any() ?
                    "Lista da(s) Infraestrutura(s) obtida com sucesso." :
                    "Nenhuma Infraestrutura encontrada.";
                return Ok(_response);
            }
            catch (Exception ex)
            {
                _response.SetError(); _response.Message = "Não foi possível adquirir a lista da(s) Infraestrutura(s)!"; _response.Data = new { ErrorMessage = ex.Message, StackTrace = ex.StackTrace ?? "No stack trace available!" };
                return StatusCode(StatusCodes.Status500InternalServerError, _response);
            }
        }

        [HttpGet("{id}", Name = "GetInfraestrutura")]
        public async Task<ActionResult<InfraestruturaDTO>> Get(int id)
        {
            try
            {
                var infraestruturaDTO = await _infraestruturaService.GetById(id);
                if (infraestruturaDTO is null)
                {
                    _response.SetNotFound(); _response.Message = "Infraestrutura não encontrada!"; _response.Data = infraestruturaDTO;
                    return NotFound(_response);
                };

                _response.SetSuccess(); _response.Message = "Infraestrutura " + infraestruturaDTO.NomeInfraestrutura + " obtida com sucesso."; _response.Data = infraestruturaDTO;
                return Ok(_response);
            }
            catch (Exception ex)
            {
                _response.SetError(); _response.Message = "Não foi possível adquirir a Infraestrutura informada!"; _response.Data = new { ErrorMessage = ex.Message, StackTrace = ex.StackTrace ?? "No stack trace available!" };
                return StatusCode(StatusCodes.Status500InternalServerError, _response);
            }
        }

        [HttpPost()]
        public async Task<ActionResult> Post([FromBody] InfraestruturaDTO infraestruturaDTO)
        {
            if (infraestruturaDTO is null)
            {
                _response.SetInvalid(); _response.Message = "Dado(s) inválido(s)!"; _response.Data = infraestruturaDTO;
                return BadRequest(_response);
            }

            try
            {
                var tipoInfraestruturaDTO = await _tipoInfraestruturaService.GetById(infraestruturaDTO.IdTipoInfraestrutura);
                if (tipoInfraestruturaDTO is null)
                {
                    _response.SetNotFound(); _response.Message = "O Tipo de Infraestrutura informado não existe!"; _response.Data = infraestruturaDTO;
                    return NotFound(_response);
                }

                if (!await InfraestruturaExists(infraestruturaDTO))
                {
                    _response.SetConflict(); _response.Message = "Já existe a Infraestrutura " + infraestruturaDTO.NomeInfraestrutura + "!"; _response.Data = infraestruturaDTO;
                    return BadRequest(_response);
                }

                await _infraestruturaService.Create(infraestruturaDTO);

                _response.SetSuccess(); _response.Message = "Infraestrutura " + infraestruturaDTO.NomeInfraestrutura + " cadastrada com sucesso."; _response.Data = infraestruturaDTO;
                return Ok(_response);
            }
            catch (Exception ex)
            {
                _response.SetError(); _response.Message = "Não foi possível cadastrar a Infraestrutura!"; _response.Data = new { ErrorMessage = ex.Message, StackTrace = ex.StackTrace ?? "No stack trace available!" };
                return StatusCode(StatusCodes.Status500InternalServerError, _response);
            }
        }

        [HttpPut()]
        public async Task<ActionResult> Put([FromBody] InfraestruturaDTO infraestruturaDTO)
        {
            if (infraestruturaDTO is null)
            {
                _response.SetInvalid(); _response.Message = "Dado(s) inválido(s)!"; _response.Data = infraestruturaDTO;
                return BadRequest(_response);
            }

            try
            {
                var existingInfraestruturaDTO = await _infraestruturaService.GetById(infraestruturaDTO.Id);
                if (existingInfraestruturaDTO is null)
                {
                    _response.SetNotFound(); _response.Message = "A Infraestrutura informada não existe!"; _response.Data = infraestruturaDTO;
                    return NotFound(_response);
                }

                var tipoInfraestruturaDTO = await _tipoInfraestruturaService.GetById(infraestruturaDTO.IdTipoInfraestrutura);
                if (tipoInfraestruturaDTO is null)
                {
                    _response.SetNotFound(); _response.Message = "O Tipo de Infraestrutura informado não existe!"; _response.Data = infraestruturaDTO;
                    return NotFound(_response);
                }

                if (!await InfraestruturaExists(infraestruturaDTO))
                {
                    _response.SetConflict(); _response.Message = "Já existe a Infraestrutura " + infraestruturaDTO.NomeInfraestrutura + "!"; _response.Data = infraestruturaDTO;
                    return BadRequest(_response);
                }

                await _infraestruturaService.Update(infraestruturaDTO);

                _response.SetSuccess(); _response.Message = "Infraestrutura " + infraestruturaDTO.NomeInfraestrutura + " alterada com sucesso."; _response.Data = infraestruturaDTO;
                return Ok(_response);
            }
            catch (Exception ex)
            {
                _response.SetError(); _response.Message = "Não foi possível alterar a Infraestrutura!"; _response.Data = new { ErrorMessage = ex.Message, StackTrace = ex.StackTrace ?? "No stack trace available!" };
                return StatusCode(StatusCodes.Status500InternalServerError, _response);
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<InfraestruturaDTO>> Delete(int id)
        {
            try
            {
                var infraestruturaDTO = await _infraestruturaService.GetById(id);
                if (infraestruturaDTO is null)
                {
                    _response.SetNotFound(); _response.Message = "Infraestrutura não encontrada!"; _response.Data = infraestruturaDTO;
                    return NotFound(_response);
                }

                await _infraestruturaService.Remove(id);

                _response.SetSuccess(); _response.Message = "Infraestrutura " + infraestruturaDTO.NomeInfraestrutura + " excluída com sucesso."; _response.Data = infraestruturaDTO;
                return Ok(_response);
            }
            catch (Exception ex)
            {
                _response.SetError(); _response.Message = "Não foi possível excluir a Infraestrutura!"; _response.Data = new { ErrorMessage = ex.Message, StackTrace = ex.StackTrace ?? "No stack trace available!" };
                return StatusCode(StatusCodes.Status500InternalServerError, _response);
            }
        }

        private async Task<bool> InfraestruturaExists(InfraestruturaDTO infraestruturaDTO)
        {
            var infraestruturasDTO = await _infraestruturaService.GetByTypeInfrastructure(infraestruturaDTO.IdTipoInfraestrutura);
            return infraestruturasDTO.FirstOrDefault(b => Operator.CompareString(b.NomeInfraestrutura, infraestruturaDTO.NomeInfraestrutura)) is not null;
        }
    }
}