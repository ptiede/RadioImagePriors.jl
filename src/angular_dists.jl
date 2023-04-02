export DiagonalVonMises, WrappedUniform

"""
    DiagonalVonMises(μ::Real, κ::Real)
    DiagonalVonMises(μ::AbstractVector{<:Real}, κ::AbstractVector{<:Real})

Constructs a Von Mises distribution, with mean `μ` and concentraion parameter `κ`.
If `μ` and `κ` are vectors then this constructs a independent multivariate Von Mises
distribution.

# Notes
This is a custom implementation since the version in `Distributions.jl` has certain properties
that do not play well (having an support only between [-π+μ, π+μ]) with usual VLBI problems.
Additionally this distribution has a special overloaded `product_distribution` method
so that concatenating multiple `DiagonalVonMises` together preserves the type. This is helpful
for `Zygote` autodiff.
"""
struct DiagonalVonMises{M, K, C} <: Dists.ContinuousMultivariateDistribution
    μ::M
    κ::K
    lnorm::C
end

Base.length(d::DiagonalVonMises) = length(d.μ)
Base.eltype(d::DiagonalVonMises) = promote_type(eltype(d.μ), eltype(d.κ))
Dists.insupport(d::DiagonalVonMises, x) = true

function DiagonalVonMises(μ::AbstractVector, κ::AbstractVector)
    lognorm = _vonmisesnorm(μ, κ)
    return DiagonalVonMises(μ, κ, lognorm)
end

function DiagonalVonMises(μ::Real, κ::Real)
    lognorm = _vonmisesnorm(μ, κ)
    return DiagonalVonMises(μ, κ, lognorm)
end

function Dists._rand!(rng::AbstractRNG, d::DiagonalVonMises, x::AbstractVector)
    dv = Dists.product_distribution(Dists.VonMises.(d.μ, d.κ))
    rand!(rng, dv, x)
end

HC.asflat(d::DiagonalVonMises) = TV.as(Vector, AngleTransform(), length(d))


function _vonmisesnorm(μ, κ)
    @assert length(μ) == length(κ) "Mean and std. dev. vector are not the same length"
    n = length(μ)
    return -n*log2π - sum(x->log(besseli0x(x)), κ)
end

function Dists._logpdf(d::DiagonalVonMises, x::Union{Real, AbstractVector{<:Real}})
    μ = d.μ
    κ = d.κ
    return _vonlogpdf(μ, κ, x) + d.lnorm
end

function _vonlogpdf(μ, κ, x)
    s = zero(eltype(μ))
    @simd for i in eachindex(μ, κ)
        s += (cos(x[i] - μ[i]) - 1)*κ[i]
    end
    return s
end

function ChainRulesCore.rrule(::typeof(_vonlogpdf), μ::Union{Real, AbstractVector}, κ::Union{Real, AbstractVector}, x::Union{Real, AbstractVector})
    s = _vonlogpdf(μ, κ, x)
    pμ = ProjectTo(μ)
    pκ = ProjectTo(κ)
    px = ProjectTo(x)

    function _vonlogpdf_pullback(Δ)
        ss = sin.(x .- μ)
        dμ = @thunk(pμ(Δ.*ss.*κ))
        dx = @thunk(px(-Δ.*ss.*κ))
        dκ = @thunk(pκ(Δ.*(cos.(x .- μ) .- 1)))
        return NoTangent(), dμ, dκ, dx
    end
    return s, _vonlogpdf_pullback
end

function Dists.product_distribution(dists::AbstractVector{<:DiagonalVonMises})
    μ = mapreduce(x->getproperty(x, :μ), vcat, dists)
    κ = mapreduce(x->getproperty(x, :κ), vcat, dists)
    lnorm = mapreduce(x->getproperty(x, :lnorm), +, dists)
    return DiagonalVonMises(μ, κ, lnorm)
end


function ChainRulesCore.rrule(::typeof(_vonmisesnorm), μ, κ::Union{Real, AbstractVector})
    v =zero(eltype(κ))
    n = length(κ)
    dκ = zero(κ)
    pκ = ProjectTo(κ)
    for i in eachindex(κ)
        κi = κ[i]
        i0 = besseli0x(κi)
        i1 = besseli1x(κi)
        v += log(i0)
        dκ[i] = (1 - i1/i0)
    end
    function _vonmisesnorm_pullback(Δ)
       Δκ = @thunk(pκ(Δ.*dκ))
        return NoTangent(), ZeroTangent(), Δκ
    end
    return -n*log2π - v, _vonmisesnorm_pullback
end


"""
    WrappedUniform(period)

Constructs a potentially multivariate uniform distribution that is wrapped a given `period`.
That is
```julia
d = WrappedUniform(period)
logpdf(d, x) ≈ logpdf(d, x+period)
```
for any `x`.

If `period` is a vector this creates a multivariate independent wrapped uniform distribution.
"""
struct WrappedUniform{T,L} <: Dists.ContinuousMultivariateDistribution
    periods::T
    lnorm::L
end

function ChainRulesCore.rrule(::typeof(Dists.logpdf), d::WrappedUniform, x::AbstractVector)
    l = Dists.logpdf(d, x)
    function _logpdf_pullback_wrappeduniform(Δ)
        Δd = @thunk(Tangent{typeof(d)}(periods = ZeroTangent(), lnorm=-unthunk(Δ)))
        return NoTangent(), Δd, ZeroTangent()
    end
    return l, _logpdf_pullback_wrappeduniform
end

Base.length(d::WrappedUniform) = length(d.periods)
Base.eltype(d::WrappedUniform) = eltype(d.periods)
Dists.insupport(::WrappedUniform, x) = true

function WrappedUniform(p::AbstractVector)
    @assert all(>(0), p) "Periods must be positive"
    lnorm = sum(log, p)
    return WrappedUniform(p, lnorm)
end

function WrappedUniform(p::Real, n::Int)
    @assert p > 0 "Period `p` must be positive"
    pvec = Fill(p, n)
    return WrappedUniform(pvec, n*log(p))
end

Dists._logpdf(d::WrappedUniform, ::AbstractVector) = -d.lnorm

function Dists._rand!(rng::AbstractRNG, d::WrappedUniform, x::AbstractVector{T}) where {T<:Real}
    rand!(rng, x)
    x .= x.*d.periods
    return x
end

function Dists.product_distribution(dists::AbstractVector{<:WrappedUniform})
    periods = mapreduce(x->getproperty(x, :periods), vcat, dists)
    return WrappedUniform(periods)

end

HC.asflat(d::WrappedUniform) = TV.as(Vector, AngleTransform(), length(d))